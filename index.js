import puppeteer from "uppeteer-core";
import getBrowserWSEndpoint from "./utils/getBrowserWSEndpoint.js";
import { InfiniteScrollItems } from "./utils/scroll.js";
import { interatorBusiness } from "./utils/interatorBusiness.js";
import { indentifyTabs } from "./utils/identifyTabs.js";

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
  googleTagAssistant.bringToFront();

  await new Promise((resolve) => setTimeout(resolve, 20000));

  // Insert search argument
  const searchInput = await googleMaps.waitForSelector("input#searchboxinput");
  await searchInput.type(process.argv.slice(2));

  // Search
  const searchButton = await googleMaps.waitForSelector(
    "button#searchbox-searchbutton"
  );
  await searchButton.click();

  await InfiniteScrollItems("div[role=feed]", googleMaps);

  await interatorBusiness("div[role=article]", googleMaps);

  await browser.close();
})();
