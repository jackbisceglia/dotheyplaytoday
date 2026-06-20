import base from "../../eslint.config.js";
import { defineConfig } from "eslint/config";

export default defineConfig(base, {
  // .astro files need a dedicated parser/plugin; typed linting covers src ts/tsx
  ignores: ["**/*.astro", ".astro/**", "**/prettier.config.js"],
});
