const puppeteer = require("puppeteer-core");
const { program } = require("commander");
const { infiniteScrollItems } = require("./utils/scroll.js");
const { iteratorBusinesses } = require("./utils/iteratorBusinesses.js");
const { checkGA4, checkSFDC, checkGADS } = require("./utils/checkTools.js");
const { searchBusiness } = require("./utils/searchBusiness.js");
const { cancelCookies } = require("./utils/cancelCookies.js");
const { convertJsonToExcel } = require("./utils/convertJsonToExcel.js");

// Config chrome environment variables
require("dotenv").config();

// Config command line options
program
  .option("-ga4, --googleanalytics4")
  .option("-sfdc, --salesforce")
  .option("-gads, --googleads");

program.parse();

const options = program.opts();

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

  let ignoreArgs = 2 + Object.keys(options).length;
  const args = process.argv.slice(ignoreArgs) || [];

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
        if (options.hasOwnProperty("googleanalytics4")) {
          const hasGA4 = await checkGA4(business.website, browser);

          if (!hasGA4) {
            leadList.push(business);
          }
        } else if (options.hasOwnProperty("salesforce")) {
          const hasSFDC = await checkSFDC(business.website, browser);

          if (hasSFDC) {
            leadList.push(business);
          }
        } else if (options.hasOwnProperty("googleads")) {
          const hasGADS = await checkGADS(business, browser);

          if (hasGADS !== undefined) {
            leadList.push(business);
          }
        } else {
          // Scrap GA4 leads by default
          const hasGA4 = await checkGA4(business.website, browser);

          if (!hasGA4) {
            leadList.push(business);
          }
        }
      }

      if (leadList.length > 0) await convertJsonToExcel(leadList, arg, options);

      console.log(`"${leadList.length}" leads from the "${arg}" search result`);

      await googleMaps.bringToFront();
    } catch (err) {
      console.error(`Failure scraping of "${arg}" search result,\n ${err}`);
    }
  }

  await browser.close();
})();
