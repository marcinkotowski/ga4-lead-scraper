import { TimeoutError } from "puppeteer";

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

export async function InfiniteScrollItems(
  scrollableSelector,
  scrapSelector,
  page
) {
  try {
    await page.waitForSelector(scrollableSelector);
    const divHandle = await page.$(scrollableSelector);

    let previousHeight = 0;
    let currentHeight = await page.evaluate((div) => {
      return div.scrollHeight;
    }, divHandle);

    let itemsList = [];

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

      // Wait for fetch new results
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fetch all search result business
      const newItems = await page.evaluate((scrapSelector) => {
        const items = Array.from(document.querySelectorAll(scrapSelector));
        return items.map((item) => item.ariaLabel);
      }, scrapSelector);

      // Add business to businessList without duplicate
      newItems.forEach((item) => {
        if (!itemsList.includes(item)) {
          itemsList.push(item);
        }
      });

      // Update current height of div after fetch new results
      currentHeight = await page.evaluate((div) => div.scrollHeight, divHandle);
      console.log(itemsList);
    }
  } catch (e) {
    console.log(e);
  }
}
