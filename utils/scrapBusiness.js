import puppeteer from "puppeteer-core";

export async function scrapBusiness(business, page) {
  const BusinessData = {
    name: "",
    website: "",
    phone: "",
  };

  const name = await page.evaluate((business) => business.ariaLabel, business);

  const website = await page.evaluate(
    () => document.querySelector("a div.fontBodyMedium")?.innerText
  );

  if (website && website.includes(".") && !website.includes("facebook.com")) {
    const phone = await page.evaluate(
      () => document.querySelectorAll("button div.fontBodyMedium")[1]?.innerText
    );

    BusinessData.name = name;
    BusinessData.website = website;

    // Validate phone number
    if (phone && !isNaN(Number(phone.replace(/\s+/g, "")))) {
      BusinessData.phone = phone;
    }

    return BusinessData;
  }
}
