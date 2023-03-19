import puppeteer from "puppeteer-core";

export async function acceptCokkies(mapPage) {
  await mapPage.waitForSelector(
    `form[action="https://consent.google.com/save"] button`
  );

  const button = await mapPage.$$(
    `form[action="https://consent.google.com/save"] button`
  )[1];

  if (!button) throw new Error("button not found");
  await button.click();
}
