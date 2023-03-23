export async function indentifyTabs(pages) {
  try {
    let indexGoogleTagAssistant;
    let indexMapPage;

    for (const [index, page] of pages.entries()) {
      const url = page.url();

      if (url.includes("chrome-extension")) {
        indexGoogleTagAssistant = index;
      } else if (url.includes("maps")) {
        indexMapPage = index;
      }
    }

    return {
      googleMaps: pages[indexMapPage],
      googleTagAssistant: pages[indexGoogleTagAssistant],
    };
  } catch (err) {
    console.error(`Error in indentifyTabs function: ${err}`);
  }
}
