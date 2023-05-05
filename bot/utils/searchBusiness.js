import puppeteer from "puppeteer-core";

export async function searchBusiness(arg, page) {
  try {
    await page.waitForSelector("input#searchboxinput");

    const searchInput = await page.$("input#searchboxinput");

    await page.evaluate(
      (searchInput, arg) => {
        searchInput.value = arg;
      },
      searchInput,
      arg
    );

    searchInput.click();

    const searchButton = await page.$("button#searchbox-searchbutton");

    await searchButton.click();

    await page.waitForNetworkIdle();
  } catch (err) {
    throw new Error(`Error in searchBusiness function: ${err}`);
  }
}
