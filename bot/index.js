import puppeteer from "puppeteer-core";
import { infiniteScrollItems } from "./utils/scroll.js";
import { iteratorBusinesses } from "./utils/iteratorBusinesses.js";
import { checkGA4 } from "./utils/checkGoogleTag.js";
import { searchBusiness } from "./utils/searchBusiness.js";
import { cancelCookies } from "./utils/cancelCookies.js";
import { convertJsonToExcel } from "./utils/convertJsonToExcel.js";

// Config chrome environment variables
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.EXECUTABLEPATH,
  });

  const googleMaps = await browser.newPage();
  await googleMaps.goto("https://www.google.pl/maps/");

  // Set screen size
  await googleMaps.setViewport({ width: 1300, height: 1024 });

  await cancelCookies(googleMaps);

  const args = process.argv.slice(2) || [];

  for (const arg of args) {
    try {
      await searchBusiness(arg, googleMaps);

      await infiniteScrollItems("div[role=feed]", googleMaps);

      const businessList = await iteratorBusinesses(
        "div[role=article]",
        googleMaps
      );

      let leadList = [];

      for (const business of businessList) {
        const hasGA4 = await checkGA4(business.website, browser);

        if (!hasGA4) {
          leadList.push(business);
        }
      }

      if (leadList.length > 0) await convertJsonToExcel(leadList, arg);

      console.log(`"${leadList.length}" leads from the "${arg}" search result`);

      await googleMaps.bringToFront();
    } catch (err) {
      console.error(`Failure scraping of "${arg}" search result,\n ${err}`);
    }
  }

  await browser.close();
})();
