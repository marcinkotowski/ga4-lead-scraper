export async function checkGA4(website, browser) {
  const page = await browser.newPage();

  // Website with https also works
  await page.goto(`http://${website}`);

  const hasGA4 = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    return scripts.some(
      (script) => script.src.includes("gtag/js") && script.src.includes("id=G")
    );
  });

  await page.close();

  return hasGA4;
}