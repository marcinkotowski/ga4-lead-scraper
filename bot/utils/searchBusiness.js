const puppeteer = require("puppeteer-core");

async function searchBusiness(arg, page) {
  try {
    await page.waitForNetworkIdle();
    await page.waitForSelector("input#searchboxinput");
    const searchInput = await page.$("input#searchboxinput");

    await page.evaluate(
      (searchInput, arg) => {
        searchInput.value = arg;
      },
      searchInput,
      arg
    );

    searchInput.focus();

    const searchButton = await page.$("button#searchbox-searchbutton");

    await searchButton.click();
    await searchButton.click();

    await page.waitForNetworkIdle();
  } catch (err) {
    throw new Error(`Error in searchBusiness function: ${err}`);
  }
}

module.exports = {
  searchBusiness,
};
