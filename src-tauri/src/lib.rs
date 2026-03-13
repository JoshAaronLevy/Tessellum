pub mod commands;
mod db;
pub mod error;
mod indexer;
pub mod models;
mod utils;

use db::Database;
use serde::{Deserialize, Serialize};
use std::{fs, path::Path};
use tauri::{Manager, PhysicalSize, WindowEvent};

pub use models::*;

const MAIN_WINDOW_LABEL: &str = "main";
const WINDOW_STATE_FILE: &str = "window-state.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SavedWindowState {
    width: u32,
    height: u32,
}

fn window_state_path(app_data_dir: &Path) -> std::path::PathBuf {
    app_data_dir.join(WINDOW_STATE_FILE)
}

fn load_window_state(app_data_dir: &Path) -> Option<SavedWindowState> {
    let state_path = window_state_path(app_data_dir);
    let contents = fs::read_to_string(state_path).ok()?;
    serde_json::from_str(&contents).ok()
}

fn save_window_state(app_data_dir: &Path, state: &SavedWindowState) {
    let state_path = window_state_path(app_data_dir);

    if let Ok(contents) = serde_json::to_vec_pretty(state) {
        if let Err(error) = fs::write(&state_path, contents) {
            log::warn!("Failed to persist window state to {:?}: {}", state_path, error);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .setup(|app| {
            let app_handle = app.handle();
            let app_data_dir = app_handle
                .path()
                .app_data_dir()
                .expect("failed to get app data directory");

            // Ensure parent directory exists before opening sqlite file.
            fs::create_dir_all(&app_data_dir)?;

            let db_path = app_data_dir.join("vault.db");

            let db_url_for_init = db_path.to_string_lossy().to_string();
            let db_url_for_error = db_url_for_init.clone();

            let db_instance = tauri::async_runtime::block_on(Database::init(&db_url_for_init))
                .map_err(|e| {
                    log::error!(
                        "Failed to initialize database at {}: {}",
                        db_url_for_error,
                        e
                    );
                    std::io::Error::new(
                        std::io::ErrorKind::Other,
                        format!(
                            "Failed to initialize database at {}: {}",
                            db_url_for_error,
                            e
                        ),
                    )
                })?;

            app.manage(models::AppState::new(db_instance));
            log::info!("Database initialized successfully");

            if let Some(main_window) = app.get_webview_window(MAIN_WINDOW_LABEL) {
                if let Some(saved_size) = load_window_state(&app_data_dir) {
                    if let Err(error) = main_window.set_size(PhysicalSize::new(saved_size.width, saved_size.height)) {
                        log::warn!("Failed to restore saved window size: {}", error);
                    }
                    if let Err(error) = main_window.center() {
                        log::warn!("Failed to center window after restoring size: {}", error);
                    }
                }

                let state_dir = app_data_dir.clone();
                let event_window = main_window.clone();
                main_window.on_window_event(move |event| match event {
                    WindowEvent::Resized(size) => {
                        // Ignore transient zero sizes some platforms can emit during minimize/init.
                        if size.width > 0 && size.height > 0 {
                            save_window_state(
                                &state_dir,
                                &SavedWindowState {
                                    width: size.width,
                                    height: size.height,
                                },
                            );
                        }
                    }
                    WindowEvent::CloseRequested { .. } => {
                        if let Ok(size) = event_window.inner_size() {
                            if size.width > 0 && size.height > 0 {
                                save_window_state(
                                    &state_dir,
                                    &SavedWindowState {
                                        width: size.width,
                                        height: size.height,
                                    },
                                );
                            }
                        }
                    }
                    _ => {}
                });
            } else {
                log::warn!("Main window '{}' not found during setup", MAIN_WINDOW_LABEL);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::notes::create_note,
            commands::notes::trash_item,
            commands::notes::read_file,
            commands::notes::write_file,
            commands::notes::search_notes,
            commands::vault::list_files,
            commands::vault::list_files_tree,
            commands::watcher::watch_vault,
            commands::vault::rename_file,
            commands::folders::create_folder,
            commands::templates::list_templates,
            commands::templates::create_note_from_template,
            commands::links::get_backlinks,
            commands::links::get_outgoing_links,
            commands::links::get_all_links,
            commands::links::resolve_wikilink,
            commands::notes::get_all_notes,
            commands::notes::get_all_tags,
            commands::notes::get_all_property_keys,
            commands::indexer::sync_vault,
            commands::graph::get_graph_data,
            commands::vault::set_vault_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    use commands::extract_wikilinks;
    use models::FileIndex;

    #[test]
    fn test_extract_wikilinks() {
        let content = "Check out [[Note 1]] and [[folder/Note 2|Custom Text]]\
        . Also \\[[escaped]].";
        let links = extract_wikilinks(content);

        assert_eq!(links.len(), 2);
        assert_eq!(links[0].target, "Note 1");
        assert_eq!(links[0].alias, None);
        assert_eq!(links[1].target, "folder/Note 2");
        assert_eq!(links[1].alias, Some("Custom Text".to_string()));
    }

    #[test]
    fn test_file_index_resolution() {
        let dir = tempdir().unwrap();
        let vault_path = dir.path().to_str().unwrap();

        // Create test structure
        fs::write(dir.path().join("Note1.md"), "content").unwrap();

        let subfolder = dir.path().join("subfolder");
        fs::create_dir(&subfolder).unwrap();
        fs::write(subfolder.join("Note2.md"), "content").unwrap();
        fs::write(subfolder.join("Note1.md"), "duplicate name").unwrap();

        let index = FileIndex::build(vault_path).unwrap();

        // Test simple resolution
        let resolved = index.resolve(vault_path, "Note2");
        assert!(resolved.is_some());
        assert!(resolved.unwrap().ends_with("Note2.md"));

        // Test that Note1 resolves to the one closest to root (shortest path)
        let resolved = index.resolve(vault_path, "Note1");
        assert!(resolved.is_some());
        let path = resolved.unwrap();
        assert!(path.ends_with("Note1.md"));
        assert!(!path.to_string_lossy().contains("subfolder"));

        // Test path-based resolution
        let resolved = index.resolve(vault_path, "subfolder/Note1");
        assert!(resolved.is_some());
        assert!(resolved.unwrap().to_string_lossy().contains("subfolder"));
    }
}
