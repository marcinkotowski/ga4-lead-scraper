import puppeteer from "puppeteer";
import { scrollAndRemove, InfiniteScrollItems } from "./utils/scroll.js";

import { interatorBusiness } from "./utils/interatorBusiness.js";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage();

  await page.goto("https://www.google.pl/maps/");

  //Accept google cookies
  const [button] = await page.$x(
    "//button[contains(., 'Zaakceptuj wszystko')]"
  );
  if (!button) throw new Error("button not found");
  await button.click();

  // Set screen size
  await page.setViewport({ width: 1300, height: 1024 });

  // Insert search argument
  const searchInput = await page.waitForSelector("input#searchboxinput");
  await searchInput.type(process.argv.slice(2));

  // Search
  const searchButton = await page.waitForSelector(
    "button#searchbox-searchbutton"
  );
  await searchButton.click();

  await InfiniteScrollItems("div[role=feed]", page);

  await interatorBusiness("div[role=article]", page);

  await browser.close();
})();
