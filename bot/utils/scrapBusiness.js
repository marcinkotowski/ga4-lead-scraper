const puppeteer = require("puppeteer-core");

async function scrapBusiness(business, page) {
  try {
    const BusinessData = {
      name: "",
      website: "",
      phone: "",
    };

    const name = await page.evaluate(
      (business) => business.ariaLabel,
      business
    );

    const website =
      (await page.evaluate(
        () => document.querySelector("a div.fontBodyMedium")?.innerText
      )) || "";

    if (website.includes(".") && !website.includes("facebook.com")) {
      const phone =
        (await page.evaluate(
          () =>
            document.querySelectorAll("button div.fontBodyMedium")[1]?.innerText
        )) || "";

      BusinessData.name = name;
      BusinessData.website = website;

      // Validate phone number
      if (!isNaN(Number(phone.replace(/\s+/g, "")))) {
        BusinessData.phone = phone;
      }

      return BusinessData;
    }
  } catch (err) {
    throw new Error(`Error in scrapBusiness function: ${err}`);
  }
}

module.exports = {
  scrapBusiness,
};
