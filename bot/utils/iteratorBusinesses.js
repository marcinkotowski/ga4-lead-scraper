import puppeteer from "puppeteer-core";
import { scrapBusiness } from "./scrapBusiness.js";

export async function iteratorBusinesses(scrapSelector, page) {
  let bussinessList = [];

  try {
    const businessContainer = await page.$$(scrapSelector);

    for (const business of businessContainer) {
      await business.click();

      // Wait for business loading
      await page.waitForNavigation({ waitUntil: "networkidle0" });

      const scrappedBusiness = await scrapBusiness(business, page);

      // scrappedBusiness is undefined when it doesn't have a website
      if (scrappedBusiness !== undefined) {
        bussinessList.push(scrappedBusiness);
      }
    }
  } catch (err) {
    console.error(`Error in iteratorBusinesses function: ${err}`);
  } finally {
    return bussinessList;
  }
}

export async function iteratorBusinessesOnEveryScroll(itemsList) {
  try {
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
  } catch (err) {
    console.error(`Error in iteratorBusinessesOnEveryScroll function: ${err}`);
  }
}
