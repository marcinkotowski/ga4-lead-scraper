import puppeteer from "puppeteer";
import { scrollAndRemove, InfiniteScrollItems } from "./utils/scroll.js";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://www.google.pl/maps/search/szko%C5%82a+licuem+jarocin/@51.9598876,17.4644428,13z"
  );

  //Accept google cookies
  const [button] = await page.$x(
    "//button[contains(., 'Zaakceptuj wszystko')]"
  );
  if (!button) throw new Error("button not found");
  await button.click();

  // Set screen size
  await page.setViewport({ width: 1300, height: 1024 });

  // Wait to load google maps
  // await page.waitForSelector("input#searchboxinput");

  // Scrap first lead results
  // const places = await page.$$("div[role=article]");

  // if (places && places.length) {
  //   for (const lead of places) {
  //     const nameLead = await page.evaluate((el) => el.ariaLabel, lead);
  //     console.log(nameLead);
  //   }
  // }

  await InfiniteScrollItems("div[role=feed]", "div[role=article]", page);

  await browser.close();
})();
