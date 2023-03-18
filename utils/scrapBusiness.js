import puppeteer from "puppeteer";

export async function scrapBusiness(business, page) {
  const DataList = [];

  //   const website = await page.$$(".fontBodyMedium");
  const website = await page.evaluate(
    () => document.querySelector("a div.fontBodyMedium").innerText
  );

  if (website.includes(".")) {
    const phone = await page.evaluate(
      () => document.querySelectorAll("button div.fontBodyMedium")[1].innerText
    );

    if (!isNaN(Number(phone.replace(/\s+/g, "")))) {
      console.log(website, phone);
    } else {
      console.log(website);
    }
  }
}
