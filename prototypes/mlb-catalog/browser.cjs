// Headless fallback for sources that WebFetch cannot render. No saved logins.
const { chromium } = require("playwright");
(async () => {
  const smoke = process.argv[2] === "--smoke";
  const url = new URL(smoke ? "about:blank" : process.argv[2]);
  if (!smoke && !["https:", "http:"].includes(url.protocol))
    throw new Error("HTTP(S) only");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url.href, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    if (smoke) await page.setContent("<body>Chromium smoke passed</body>");
    console.log(await page.locator("body").innerText({ timeout: 15000 }));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
