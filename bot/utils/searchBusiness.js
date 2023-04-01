import puppeteer from "puppeteer-core";

export async function searchBusiness(arg, page) {
  try {
    const searchInput = await page.$("input#searchboxinput");

    await searchInput.evaluate((input) => {
      input.value = "";
    }, searchInput);

    await searchInput.type(arg);

    const searchButton = await page.$("button#searchbox-searchbutton");

    await searchButton.click();

    await page.waitForNavigation({
      waitUntil: "networkidle0",
    });
  } catch (err) {
    throw new Error(`Error in searchBusiness function: ${err}`);
  }
}
