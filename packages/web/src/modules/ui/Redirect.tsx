import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

export function Redirect(props: { readonly href: string }) {
  const navigate = useNavigate();
  createEffect(
    () => props.href,
    (href) => {
      navigate(href, { replace: true });
    },
  );
  return null;
}
