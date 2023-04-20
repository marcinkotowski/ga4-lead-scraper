import puppeteer from "puppeteer-core";

export async function searchBusiness(arg, page) {
  try {
    await page.evaluate((searchKey) => {
      const searchInput = document.querySelector("input#searchboxinput");
      searchInput.value = searchKey;
      searchInput.focus();
    }, arg);

    const searchButton = await page.$("button#searchbox-searchbutton");

    await searchButton.click();

    await page.waitForNetworkIdle();
  } catch (err) {
    throw new Error(`Error in searchBusiness function: ${err}`);
  }
}
