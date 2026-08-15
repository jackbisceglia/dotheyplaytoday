import { useHead } from "@solidjs/web";

export function usePageMetadata(title: string, description: string) {
  useHead([
    { tag: "title", props: { children: title } },
    { tag: "meta", props: { name: "description", content: description } },
  ]);
}
