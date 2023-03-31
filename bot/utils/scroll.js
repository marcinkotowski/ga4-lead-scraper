import { TimeoutError } from "puppeteer-core";

export async function infiniteScrollItems(scrollableSelector, page) {
  try {
    await page.waitForSelector(scrollableSelector);
    const divHandle = await page.$(scrollableSelector);

    let previousHeight = 0;
    let currentHeight = await page.evaluate((div) => {
      return div.scrollHeight;
    }, divHandle);

    while (previousHeight !== currentHeight) {
      previousHeight = currentHeight;

      // Scroll div to the bottom
      await page.evaluate(
        (div, currentHeight) => {
          div.scrollTop = currentHeight;
        },
        divHandle,
        currentHeight
      );

      // Wait for new businesses fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update current height of div after fetch new results
      currentHeight = await page.evaluate((div) => div.scrollHeight, divHandle);
    }
  } catch (err) {
    throw new Error(`Error in infiniteScrollItems function: ${err}`);
  }
}

export async function scrollAndRemove(selector, page) {
  // Wait for first google maps results
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    const divHandle = await page.$(selector);
    await page.evaluate((el) => el.scrollIntoView(), divHandle);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await page.evaluate((el) => el.remove(), divHandle);

    return scrollAndRemove(selector, page);
  } catch (e) {
    if (e instanceof TimeoutError) {
      console.log("Scrapped all search results");
    }
  }
}
