const ExcelJS = require("exceljs");
const fs = require("fs");

async function convertJsonToExcel(json, sheetName, options) {
  const workbook = new ExcelJS.Workbook();
  const extraWorkbook = new ExcelJS.Workbook();

  // Name sheet and ignore 31 character limit warn
  const originalConsoleWarn = console.warn;
  console.warn = function () {};
  const worksheet = workbook.addWorksheet(sheetName);
  const extraWorksheet = extraWorkbook.addWorksheet(sheetName);
  console.warn = originalConsoleWarn;

  worksheet.columns = [
    {
      header: "Business",
      key: "name",
      width: 60,
    },
    {
      header: "Website",
      key: "website",
      width: 30,
    },
    {
      header: "Phone number",
      key: "phone",
      width: 30,
    },
  ];

  if (options.hasOwnProperty("googleads")) {
    extraWorkbook.columns = [
      {
        header: "Business",
        key: "name",
        width: 60,
      },
      {
        header: "Website",
        key: "website",
        width: 30,
      },
      {
        header: "Phone number",
        key: "phone",
        width: 30,
      },
    ];
  }

  const IsSpawn = process.env.IS_SPAWN === "true";
  const isDev = process.env.NODE_ENV === "development";
  let savedPath = "";

  // Production
  if (IsSpawn && !isDev) {
    savedPath = "../../../results";
  }
  // Develompent with electron app
  else if (IsSpawn && isDev) {
    savedPath = "../results";
  }
  // Development only with scraper
  else {
    savedPath = "./results";
  }

  if (!fs.existsSync(savedPath)) {
    fs.mkdirSync(savedPath);
  }

  let writePath = "";
  let extraWritePath = "";

  if (options.hasOwnProperty("googleads")) {
    let containGA4 = [];
    let notContainGA4 = [];

    json.forEach((business) => {
      if (business.hasGADS) {
        containGA4.push(business);
      } else {
        notContainGA4.push(business);
      }
    });

    if (!fs.existsSync(`${savedPath}/GADS`)) {
      fs.mkdirSync(`${savedPath}/GADS`);
    }

    if (!fs.existsSync(`${savedPath}/GADS/contain`)) {
      fs.mkdirSync(`${savedPath}/GADS/contain`);
    }

    if (!fs.existsSync(`${savedPath}/GADS/not-contain`)) {
      fs.mkdirSync(`${savedPath}/GADS/not-contain`);
    }

    if (containGA4.length > 0)
      writePath = `${savedPath}/GADS/contain/${sheetName}.xlsx`;

    if (notContainGA4.length > 0)
      extraWritePath = `${savedPath}/GADS/not-contain/${sheetName}.xlsx`;

    worksheet.addRows(containGA4);
    extraWorksheet.addRows(notContainGA4);
  } else if (options.hasOwnProperty("salesforce")) {
    if (!fs.existsSync(`${savedPath}/SFDC`)) {
      fs.mkdirSync(`${savedPath}/SFDC`);
    }

    writePath = `${savedPath}/SFDC/${sheetName}.xlsx`;

    worksheet.addRows(json);
  } else {
    if (!fs.existsSync(`${savedPath}/GA4`)) {
      fs.mkdirSync(`${savedPath}/GA4`);
    }
    writePath = `${savedPath}/GA4/${sheetName}.xlsx`;

    worksheet.addRows(json);
  }

  try {
    if (options.hasOwnProperty("googleads")) {
      if (writePath) await workbook.xlsx.writeFile(writePath);
      if (extraWritePath) await extraWorkbook.xlsx.writeFile(extraWritePath);
    } else {
      await workbook.xlsx.writeFile(writePath);
    }
  } catch (err) {
    throw new Error(`Error in convertJsonToExcel function: ${err}`);
  }
}

module.exports = {
  convertJsonToExcel,
};
