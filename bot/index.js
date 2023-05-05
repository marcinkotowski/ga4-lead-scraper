const puppeteer = require("puppeteer-core");
const { infiniteScrollItems } = require("./utils/scroll.js");
const { iteratorBusinesses } = require("./utils/iteratorBusinesses.js");
const { checkGA4 } = require("./utils/checkGoogleTag.js");
const { searchBusiness } = require("./utils/searchBusiness.js");
const { cancelCookies } = require("./utils/cancelCookies.js");
const { convertJsonToExcel } = require("./utils/convertJsonToExcel.js");

// Config chrome environment variables
require("dotenv").config();

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
