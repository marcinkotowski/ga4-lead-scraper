import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://www.google.pl/maps/search/sklep+z+zabawkami/@52.4069751,16.9182937,13z"
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
  await page.waitForSelector("input#searchboxinput");

  // Scrap first lead results
  const places = await page.$$("div[role=article]");
  for (const lead of places) {
    const nameLead = await page.evaluate((el) => el.ariaLabel, lead);
    console.log(nameLead);
  }

  await browser.close();
})();
