import { transliterate } from "transliteration";

export const searchKey = (text: string) =>
  transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
