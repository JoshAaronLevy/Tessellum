export interface SelectionRange {
    from: number;
    to: number;
}

export interface FormattingResult {
    change: {
        from: number;
        to: number;
        insert: string;
    };
    text: string;
    selection: SelectionRange;
}

interface MarkerBounds {
    markerStart: number;
    contentStart: number;
    contentEnd: number;
    markerEnd: number;
}

const BOLD_MARKER = "**";

function findBoldBounds(text: string, selection: SelectionRange): MarkerBounds | null {
    const markerPositions: number[] = [];

    for (let index = text.indexOf(BOLD_MARKER); index !== -1; index = text.indexOf(BOLD_MARKER, index + BOLD_MARKER.length)) {
        markerPositions.push(index);
    }

    for (let index = 0; index < markerPositions.length - 1; index += 2) {
        const markerStart = markerPositions[index];
        const markerEndStart = markerPositions[index + 1];
        const contentStart = markerStart + BOLD_MARKER.length;
        const contentEnd = markerEndStart;
        const selectionInsideContent =
            selection.from >= contentStart &&
            selection.to <= contentEnd &&
            (selection.from !== selection.to || (selection.from >= contentStart && selection.from <= contentEnd));

        if (!selectionInsideContent || contentStart > contentEnd) {
            continue;
        }

        return {
            markerStart,
            contentStart,
            contentEnd,
            markerEnd: markerEndStart + BOLD_MARKER.length,
        };
    }

    return null;
}

export function isBoldActive(text: string, selection: SelectionRange): boolean {
    return findBoldBounds(text, selection) !== null;
}

export function toggleBold(text: string, selection: SelectionRange): FormattingResult {
    const bounds = findBoldBounds(text, selection);

    if (bounds) {
        const nextText =
            text.slice(0, bounds.markerStart) +
            text.slice(bounds.contentStart, bounds.contentEnd) +
            text.slice(bounds.markerEnd);

        const removedPrefix = BOLD_MARKER.length;

        return {
            change: {
                from: bounds.markerStart,
                to: bounds.markerEnd,
                insert: text.slice(bounds.contentStart, bounds.contentEnd),
            },
            text: nextText,
            selection: {
                from: selection.from - removedPrefix,
                to: selection.to - removedPrefix,
            },
        };
    }

    if (selection.from === selection.to) {
        const nextText =
            text.slice(0, selection.from) +
            `${BOLD_MARKER}${BOLD_MARKER}` +
            text.slice(selection.to);

        return {
            change: {
                from: selection.from,
                to: selection.to,
                insert: `${BOLD_MARKER}${BOLD_MARKER}`,
            },
            text: nextText,
            selection: {
                from: selection.from + BOLD_MARKER.length,
                to: selection.to + BOLD_MARKER.length,
            },
        };
    }

    const selectedText = text.slice(selection.from, selection.to);
    const nextText =
        text.slice(0, selection.from) +
        BOLD_MARKER +
        selectedText +
        BOLD_MARKER +
        text.slice(selection.to);

    return {
        change: {
            from: selection.from,
            to: selection.to,
            insert: `${BOLD_MARKER}${selectedText}${BOLD_MARKER}`,
        },
        text: nextText,
        selection: {
            from: selection.from + BOLD_MARKER.length,
            to: selection.to + BOLD_MARKER.length,
        },
    };
}
