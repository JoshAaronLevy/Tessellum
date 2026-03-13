import { Bold } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToolbarButtonProps {
    ariaLabel: string;
    title: string;
    isActive?: boolean;
    onClick?: () => void;
    onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ToolbarButton({ ariaLabel, title, isActive = false, onClick, onMouseDown }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            title={title}
            aria-pressed={isActive}
            onMouseDown={onMouseDown}
            onClick={onClick}
            className={cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-[#4b5563] shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2",
                isActive
                    ? "border-[#93c5fd] bg-[#dbeafe] text-[#1d4ed8] hover:border-[#60a5fa] hover:bg-[#bfdbfe]"
                    : "border-transparent bg-transparent hover:border-[#d1d5db] hover:bg-[#e5e7eb]"
            )}
        >
            <Bold className="h-4 w-4" strokeWidth={2.25} />
        </button>
    );
}

interface EditorToolbarProps {
    toolbarState: {
        bold: boolean;
    };
    onBoldToggle: () => void;
    onToolbarMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
}

export function EditorToolbar({ toolbarState, onBoldToggle, onToolbarMouseDown }: EditorToolbarProps) {
    return (
        <div
            className="flex w-[52px] flex-col items-center gap-1 rounded-lg border border-[#d1d1d1] bg-[#f1f1f1] p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            aria-label="Formatting toolbar"
            onMouseDown={onToolbarMouseDown}
        >
            <ToolbarButton
                ariaLabel="Bold formatting"
                title="Bold"
                isActive={toolbarState.bold}
                onMouseDown={onToolbarMouseDown}
                onClick={onBoldToggle}
            />
        </div>
    );
}
