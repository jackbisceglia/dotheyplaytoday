import base from "../../eslint.config.js";
import { defineConfig } from "eslint/config";

export default defineConfig(base, {
  ignores: ["dist/**", "**/prettier.config.js"],
});
