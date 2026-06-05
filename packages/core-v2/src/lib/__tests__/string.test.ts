import { describe, expect, it } from "vitest";

import { StringParts } from "../string.js";

describe("StringParts", () => {
  describe("core logic", () => {
    it("builds from initial parts", () => {
      expect(StringParts("error=DatabaseWriteError", "op=save").make()).toBe(
        "error=DatabaseWriteError op=save",
      );
    });

    it("builds strings one part at a time", () => {
      expect(
        StringParts()
          .add("error=DatabaseWriteError")
          .add("operation=notify.markSent")
          .make(),
      ).toBe("error=DatabaseWriteError operation=notify.markSent");
    });

    it("adds nullable parts only when present", () => {
      expect(
        StringParts()
          .add("error=DatabaseWriteError")
          .addNullable(undefined)
          .addNullable(null)
          .addNullable("operation=notify.markSent")
          .make(),
      ).toBe("error=DatabaseWriteError operation=notify.markSent");
    });

    it("adds parts conditionally", () => {
      expect(
        StringParts()
          .add("error=DatabaseWriteError")
          .addIf(false, "metadata=skipped")
          .addIf(true, "operation=notify.markSent")
          .make(),
      ).toBe("error=DatabaseWriteError operation=notify.markSent");
    });
  });

  describe("plural logic", () => {
    it("adds multiple parts at once", () => {
      expect(
        StringParts()
          .addParts("a", "b", "c")
          .addPartsIf(false, "d", "e")
          .addPartsIf(true, "f", "g")
          .make("|"),
      ).toBe("a|b|c|f|g");
    });

    it("adds multiple nullable parts at once", () => {
      expect(
        StringParts()
          .addPartsNullable("a", null, "b", undefined, "c")
          .make("|"),
      ).toBe("a|b|c");
    });
  });

  describe("delimiter testing", () => {
    it("uses a space by default", () => {
      expect(StringParts("first", "second").make()).toBe("first second");
    });

    it("uses a custom delimiter", () => {
      expect(StringParts("first", "second").make("\n")).toBe(
        "first\nsecond",
      );
    });

    it("preserves empty strings", () => {
      expect(StringParts("", "next").make(":")).toBe(":next");
    });
  });

  describe("misc", () => {
    it("copies initial parts", () => {
      const parts = ["first"];
      const builder = StringParts(...parts);

      parts.push("second");

      expect(builder.make()).toBe("first");
    });

    it("reuses the current builder for no-op additions", () => {
      const builder = StringParts("a");

      expect(builder.addParts()).toBe(builder);
      expect(builder.addNullable(undefined)).toBe(builder);
      expect(builder.addPartsNullable(null, undefined)).toBe(builder);
      expect(builder.addIf(false, "b")).toBe(builder);
      expect(builder.addPartsIf(false, "b", "c")).toBe(builder);
    });
  });
});
