import { Title } from "@solidjs/meta";
import { createSignal, onMount } from "solid-js";

import { pingApi } from "~/lib/api-client";

type ApiStatus = "checking" | "ok" | "error";

export default function Home() {
  const [status, setStatus] = createSignal<ApiStatus>("checking");
  const [message, setMessage] = createSignal("Checking the API scaffold...");

  const checkApi = async () => {
    setStatus("checking");
    setMessage("Checking the API scaffold...");

    try {
      const response = await pingApi();
      setStatus("ok");
      setMessage(`${response.service} responded with a typed ping.`);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not reach the API.",
      );
    }
  };

  onMount(() => {
    void checkApi();
  });

  return (
    <main class="page">
      <Title>Do They Play Today</Title>

      <section class="panel">
        <p class="eyebrow">Public signup scaffold</p>
        <h1 class="title">Do They Play Today?</h1>
        <p class="body">
          Follow your team and get notified on game days. This page stays
          intentionally small for the scaffold PR; the richer landing page
          design is stashed separately.
        </p>

        <div class="ping">
          <p class="ping-label">API status</p>

          <div class="status-row">
            <div class="status-pill" data-state={status()}>
              <span class="status-dot" />
              {status() === "checking"
                ? "Checking"
                : status() === "ok"
                  ? "Online"
                  : "Offline"}
            </div>
            <p class="status-message">{message()}</p>
          </div>

          <div class="actions">
            <button
              class="button"
              onClick={() => void checkApi()}
              disabled={status() === "checking"}
            >
              {status() === "checking" ? "Checking..." : "Ping API"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
