import type { ParentProps } from "solid-js";

// Guard + user context + app chrome land here in a later step.
// Pass-through for now so introducing the file is behavior-neutral.
export function AuthenticatedShell(props: ParentProps) {
  return <>{props.children}</>;
}
