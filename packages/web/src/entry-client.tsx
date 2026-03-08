// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const app = document.getElementById("app");

if (!(app instanceof HTMLElement)) {
  throw new Error("Missing #app root element");
}

mount(() => <StartClient />, app);
