import { useHref } from "@solidjs/router";

// Base-aware link to the site root. Pages and modules use this instead of
// threading a homeHref prop down from the router.
export const useHomeHref = () => useHref(() => "/");
