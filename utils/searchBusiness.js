import puppeteer from "puppeteer-core";

export async function searchBusiness(arg, page) {
  const searchInput = await page.waitForSelector("input#searchboxinput");

  await searchInput.evaluate((input) => {
    input.value = "";
  }, searchInput);

  await searchInput.type(arg);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const searchButton = await page.waitForSelector(
    "button#searchbox-searchbutton"
  );

  await searchButton.click();
}
