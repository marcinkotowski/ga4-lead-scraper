const xlsx = require("xlsx");

async function convertJsonToExcel(json, sheetName) {
  const workBook = xlsx.utils.book_new();
  const workSheet = xlsx.utils.json_to_sheet(json);

  xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);
}

module.exports = {
  convertJsonToExcel,
};
