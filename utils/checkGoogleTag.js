import { TimeoutError } from "puppeteer-core";

export async function checkGA4(website, browser) {
  const page = await browser.newPage();

  try {
    // Website with https also works
    await page.goto(`http://${website}`, { waitUntil: "domcontentloaded" });
  } catch (err) {
    if (err instanceof TimeoutError) {
      try {
        // Retry page loading with longer timeout
        await page
          .goto(`http://${website}`, {
            waitUntil: "domcontentloaded",
            timeout: 10000,
          })
          .catch(() => {
            console.log(`${website} takes too long to load`);
          });
      } catch (err) {}
    }
  }

  const hasGA4 = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    return scripts.some(
      (script) => script.src.includes("gtag/js") && script.src.includes("id=G")
    );
  });

  await page.close();

  return hasGA4;
}
