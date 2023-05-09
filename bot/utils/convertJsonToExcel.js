const ExcelJS = require("exceljs");
const fs = require("fs");

async function convertJsonToExcel(json, sheetName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.addRows(json);

  const IsSpawn = process.env.IS_SPAWN === "true";
  const isDev = process.env.NODE_ENV === "development";
  let writePath = "";
  let savedPath = "";

  // Production
  if (IsSpawn && !isDev) {
    savedPath = "../../../results";
    writePath = `../../../results/${sheetName}.xlsx`;
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

  try {
    await workbook.xlsx.writeFile(writePath);
  } catch (error) {
    throw new Error(`Error in convertJsonToExcel function: ${err}`);
  }
}

module.exports = {
  convertJsonToExcel,
};
