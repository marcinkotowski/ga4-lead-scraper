const { TimeoutError } = require("puppeteer-core");

async function checkGA4(website, browser) {
  let page = null;

  try {
    page = await browser.newPage();

    await page.goto(`http://${website}`, {
      waitUntil: "networkidle0",
    });

    const hasGA4 = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll("script[src*='gtag/js']")
      );
      return scripts.some((script) => script.src.includes("id=G"));
    });

    return hasGA4;
  } catch (err) {
    if (err instanceof TimeoutError) {
      // console.error(`${website} took too long to load`);
    } else {
      // console.error(`${website} generate error: ${err}`);
    }
    // True means that it's not a lead
    return true;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

async function checkSFDC(website, browser) {
  let page = null;

  try {
    page = await browser.newPage();
    await page.waitForNetworkIdle();

    await page.goto(`http://${website}`, {
      waitUntil: "networkidle0",
    });

    const hasSFDC = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));

      return scripts.some((script) =>
        script.textContent.includes("salesforce")
      );
    });

    return hasSFDC;
  } catch (err) {
    if (err instanceof TimeoutError) {
      // console.error(`${website} took too long to load`);
    } else {
      // console.error(`${website} generate error: ${err}`);
    }
    return false;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

async function checkGADS(business, browser) {
  let page = null;

  try {
    page = await browser.newPage();

    await page.goto(`http://${business.website}`, {
      waitUntil: "networkidle0",
    });

    const hasGADS = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script[src]"));
      if (scripts.length > 0) {
        return scripts.some((script) => {
          if (script.src.includes("gtag/js")) {
            return script.src.includes("id=AW") || script.src.match(/id=(\d+)/);
          } else {
            return (
              script.src.includes("googleads") ||
              script.src.includes("doubleclick")
            );
          }
        });
      }
    });

    return (business.hasGADS = hasGADS);
  } catch (err) {
    if (err instanceof TimeoutError) {
      // console.error(`${business.website} took too long to load`);
    } else {
      // console.error(`${business.website} generate error: ${err}`);
    }
  } finally {
    if (page) {
      // await page.close();
    }
  }
}

module.exports = {
  checkGA4,
  checkSFDC,
  checkGADS,
};
