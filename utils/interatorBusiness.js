import puppeteer from "puppeteer-core";
import { scrapBusiness } from "./scrapBusiness.js";

export async function interatorBusiness(scrapSelector, page) {
  const businessList = await page.$$(scrapSelector);

  for (const business of businessList) {
    await business.click();
    // Delay of click next result
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await scrapBusiness(business, page);
  }
}

export async function interatorBusinessOnEveryScroll(itemsList) {
  // Fetch all search result business
  const businessList = await page.evaluate((scrapSelector) => {
    const items = Array.from(document.querySelectorAll(scrapSelector));
    return items.map((item) => item);
  }, scrapSelector);

  // Add business to businessList without duplicate
  businessList.forEach((item) => {
    if (!itemsList.includes(item)) {
      itemsList.push(item);
    }
  });

  return itemsList;
}
