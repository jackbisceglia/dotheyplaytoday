import { getRequestEvent, useHead } from "@solidjs/web";

/** Crawlers fetch `og:image` themselves, so it has to be absolute. */
function getOgImageUrl() {
  const url = getRequestEvent()?.request.url ?? document.baseURI;

  return new URL("/og.png", url).href;
}

export function usePageMetadata(title: string, description: string) {
  const image = getOgImageUrl();

  useHead([
    { tag: "title", props: { children: title } },
    { tag: "meta", props: { name: "description", content: description } },

    { tag: "meta", props: { property: "og:type", content: "website" } },
    {
      tag: "meta",
      props: { property: "og:site_name", content: "dotheyplaytoday" },
    },
    { tag: "meta", props: { property: "og:title", content: title } },
    {
      tag: "meta",
      props: { property: "og:description", content: description },
    },
    { tag: "meta", props: { property: "og:image", content: image } },
    { tag: "meta", props: { property: "og:image:width", content: "1200" } },
    { tag: "meta", props: { property: "og:image:height", content: "630" } },

    // Twitter falls back to Open Graph for everything but the card type.
    {
      tag: "meta",
      props: { name: "twitter:card", content: "summary_large_image" },
    },
  ]);
}
