import { ReactNode } from "react";
import { Bold, Italic, List } from "lucide-react";

interface ToolbarButtonProps {
    ariaLabel: string;
    title: string;
    children: ReactNode;
}

function ToolbarButton({ ariaLabel, title, children }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            title={title}
            disabled
            className="flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-gray-500 shadow-none transition-colors disabled:cursor-default disabled:opacity-100"
        >
            {children}
        </button>
    );
}

export function EditorToolbar() {
    return (
        <div
            className="flex w-[52px] flex-col items-center gap-1 rounded-lg border border-[#d1d1d1] bg-[#f1f1f1] p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            aria-label="Formatting toolbar"
        >
            <ToolbarButton ariaLabel="Bold formatting" title="Bold">
                <Bold className="h-4 w-4" strokeWidth={2.25} />
            </ToolbarButton>
            <ToolbarButton ariaLabel="Italic formatting" title="Italic">
                <Italic className="h-4 w-4" strokeWidth={2.25} />
            </ToolbarButton>
            <ToolbarButton ariaLabel="List formatting" title="List">
                <List className="h-4 w-4" strokeWidth={2.25} />
            </ToolbarButton>
        </div>
    );
}
