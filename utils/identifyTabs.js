export async function indentifyTabs(pages) {
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

  //   console.log("gta: " + indexGoogleTagAssistant);
  //   console.log("maps: " + indexMapPage);

  return {
    googleMaps: pages[indexMapPage],
    googleTagAssistant: pages[indexGoogleTagAssistant],
  };
}
