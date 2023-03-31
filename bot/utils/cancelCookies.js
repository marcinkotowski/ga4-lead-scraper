import puppeteer from "puppeteer-core";

export async function cancelCookies(page) {
  try {
    const cancelButton = await page.waitForSelector("form button");

    if (!cancelButton) throw new Error("button not found");

    await cancelButton.click();

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
  } catch (err) {
    throw new Error(`Error in cancelCookies function: ${err}`);
  }
}
