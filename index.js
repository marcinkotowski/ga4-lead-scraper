import puppeteer from "puppeteer-core";
import getBrowserWSEndpoint from "./utils/getBrowserWSEndpoint.js";
import { infiniteScrollItems } from "./utils/scroll.js";
import { iteratorBusinesses } from "./utils/iteratorBusinesses.js";
import { indentifyTabs } from "./utils/identifyTabs.js";
import { checkGA4 } from "./utils/checkGoogleTag.js";

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await getBrowserWSEndpoint(),
  });

  const pages = await browser.pages();

  const { googleMaps, googleTagAssistant } = await indentifyTabs(pages);

  // Set screen size
  await googleMaps.setViewport({ width: 1300, height: 1024 });
  await googleTagAssistant.setViewport({ width: 1300, height: 1024 });

  // googleMaps.bringToFront();
  // googleTagAssistant.bringToFront();

  // await new Promise((resolve) => setTimeout(resolve, 20000));

  // Insert search argument
  const searchInput = await googleMaps.waitForSelector("input#searchboxinput");
  await searchInput.type(process.argv.slice(2));

  // Search
  const searchButton = await googleMaps.waitForSelector(
    "button#searchbox-searchbutton"
  );
  await searchButton.click();

  await infiniteScrollItems("div[role=feed]", googleMaps);

  const businessList = await iteratorBusinesses(
    "div[role=article]",
    googleMaps
  );

  let leadList = [];

  for (const business of businessList) {
    const hasGA4 = await checkGA4(business.website, browser);

    if (hasGA4) {
      leadList.push;
    }
  }

  googleMaps.bringToFront();

  console.log(leadList);

  // await browser.close();
})();
