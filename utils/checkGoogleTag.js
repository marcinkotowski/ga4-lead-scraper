import { TimeoutError } from "puppeteer-core";

export async function checkGA4(website, browser) {
  try {
    const page = await browser.newPage();

    await page.goto(`http://${website}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    const hasGA4 = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      return scripts.some(
        (script) =>
          script.src.includes("gtag/js") && script.src.includes("id=G")
      );
    });

    await page.close();

    return hasGA4;
  } catch (err) {
    console.error(`${website} generate error: ${err}`);
    // True means that it's not a lead
    return true;
  }
}
