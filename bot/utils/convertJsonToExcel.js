const xlsx = require("xlsx");
const fs = require("fs");

async function convertJsonToExcel(json, sheetName) {
  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(json);

  xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

  const IsSpawn = process.env.IS_SPAWN === "true";
  const isDev = process.env.NODE_ENV === "development";
  let writePath = "";
  let savedPath = "";

  // Production
  if (IsSpawn && !isDev) {
    savedPath = "../../results";
    writePath = `../../results/${sheetName}.xlsx`;
  }
  // Develompent with electron app
  else if (IsSpawn && isDev) {
    savedPath = "../results";
    writePath = `../results/${sheetName}.xlsx`;
  }
  // Development only with scraper
  else {
    savedPath = "./results";
    writePath = `./results/${sheetName}.xlsx`;
  }

  if (!fs.existsSync(savedPath)) {
    fs.mkdirSync(savedPath);
  }

  xlsx.writeFile(workBook, writePath);
}

module.exports = {
  convertJsonToExcel,
};
