import { describe, expect, it } from "vitest";
import { isBoldActive, toggleBold } from "./markdownFormatting";

describe("markdownFormatting", () => {
    it("inserts an empty bold marker pair for a cursor selection", () => {
        const result = toggleBold("hello", { from: 2, to: 2 });

        expect(result.text).toBe("he****llo");
        expect(result.selection).toEqual({ from: 4, to: 4 });
    });

    it("wraps selected text in bold markers", () => {
        const result = toggleBold("hello world", { from: 0, to: 11 });

        expect(result.text).toBe("**hello world**");
        expect(result.selection).toEqual({ from: 2, to: 13 });
    });

    it("removes bold markers when the selection is already bold", () => {
        const result = toggleBold("**hello world**", { from: 2, to: 13 });

        expect(result.text).toBe("hello world");
        expect(result.selection).toEqual({ from: 0, to: 11 });
    });

    it("treats a cursor inside bold text as active and removes the markers", () => {
        expect(isBoldActive("**hello world**", { from: 8, to: 8 })).toBe(true);

        const result = toggleBold("**hello world**", { from: 8, to: 8 });

        expect(result.text).toBe("hello world");
        expect(result.selection).toEqual({ from: 6, to: 6 });
    });

    it("does not mark plain text as bold", () => {
        expect(isBoldActive("hello world", { from: 5, to: 5 })).toBe(false);
    });

    it("does not treat text between bold spans as active", () => {
        expect(isBoldActive("**a** test **b**", { from: 8, to: 8 })).toBe(false);
    });
});
