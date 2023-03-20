export async function checkGA4(website, browser) {
  const page = browser.newPage();

  await page.goto(website);

  const hasGA4 = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll("script[src]"));
    return scripts.some(
      (script) => script.src.includes("gtag/js") && script.src.includes("id=G")
    );
  });

  await page.close();

  return hasGA4;
}
