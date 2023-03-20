import puppeteer from "puppeteer-core";
import { scrapBusiness } from "./scrapBusiness.js";

export async function iteratorBusinesses(scrapSelector, page) {
  let bussinessList = [];
  const businessContainer = await page.$$(scrapSelector);

  for (const business of businessContainer) {
    await business.click();

    // Delay of click next result
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let scrappedBusiness = await scrapBusiness(business, page);
    bussinessList.push(scrappedBusiness);
  }

  return bussinessList;
}

export async function iteratorBusinessesOnEveryScroll(itemsList) {
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