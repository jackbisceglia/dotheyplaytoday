import { createSignal, onCleanup } from "solid-js";

const rejectionDurationMs = 280;
const messageDurationMs = 2400;

export function useSelectionRejection(message: string) {
  const [rejectedSelectionId, setRejectedSelectionId] = createSignal<string>();
  const [rejectionMessage, setRejectionMessage] = createSignal<string>();

  let rejectionFrame: number | undefined;
  let rejectionTimer: number | undefined;
  let messageTimer: number | undefined;

  const clearRejection = () => {
    setRejectedSelectionId(undefined);
    setRejectionMessage(undefined);

    if (rejectionFrame !== undefined)
      window.cancelAnimationFrame(rejectionFrame);
    if (rejectionTimer !== undefined) window.clearTimeout(rejectionTimer);
    if (messageTimer !== undefined) window.clearTimeout(messageTimer);
  };

  const rejectSelection = (selectionId: string) => {
    clearRejection();

    rejectionFrame = window.requestAnimationFrame(() => {
      setRejectedSelectionId(selectionId);
      setRejectionMessage(message);
      rejectionTimer = window.setTimeout(() => {
        setRejectedSelectionId(undefined);
      }, rejectionDurationMs);
      messageTimer = window.setTimeout(() => {
        setRejectionMessage(undefined);
      }, messageDurationMs);
    });
  };

  onCleanup(clearRejection);

  return {
    rejectedSelectionId,
    rejectionMessage,
    rejectSelection,
    clearRejection,
  } as const;
}
