const { spawn } = require("child_process");

const runButton = document.getElementById("run");
const searchContainer = document.getElementById("search-container");
let childrenCount = searchContainer.childElementCount;
const addButton = document.getElementById("add");

addButton.addEventListener("click", addInput);
runButton.addEventListener("click", runScrapingBot);

searchContainer.addEventListener("click", (event) => {
  // Remove selected search-key div
  if (event.target && event.target.id === "remove") {
    const searchKeyDiv = event.target.parentNode;
    searchKeyDiv.remove();
  }
});

function runScrapingBot() {
  const searchKeys = Array.from(document.querySelectorAll(".search-key"));

  let inputsValue = [];
  let buttons = [];
  let icons = [];
  let indexOfArg = 0;

  searchKeys.forEach((searchKey) => {
    const inputValue = searchKey.querySelector("input").value;
    const button = searchKey.querySelector("button");
    const icon = searchKey.querySelector("i");

    button.id = "in-progress";
    icon.className = "fa-solid fa-ellipsis fa-fade fa-sm";

    inputsValue.push(inputValue);
    buttons.push(button);
    icons.push(icon);
  });

  const scrapingBot = spawn("node", ["../bot/index.js", ...inputsValue], {
    cwd: "../bot/",
  });

  scrapingBot.stdout.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split('"');
    const countLeads = parseInt(splitMessage[1]);
    const searchKey = splitMessage[3];

    if (countLeads > 0) {
      buttons[indexOfArg].id = "success";
      icons[indexOfArg].className = "fa-solid fa-check fa-sm";
    } else {
      buttons[indexOfArg].id = "empty";
      icons[indexOfArg].className = "fa-solid fa-shop-slash fa-sm";
    }

    indexOfArg++;

    console.log(`countLeads: ${countLeads}`);
    console.log(`searchKey: ${searchKey}`);
  });

  scrapingBot.stderr.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split("\n");
    const arg = splitMessage[0].split('"')[1];

    buttons[indexOfArg].id = "error";
    icons[indexOfArg].className = "fa-solid fa-exclamation fa-sm";

    indexOfArg++;
    // const error = splitMessage[1];
    console.log("fail: ", arg);
  });

  scrapingBot.on("close", (code) => {
    while (indexOfArg != inputsValue.length) {
      buttons[indexOfArg].id = "error";
      icons[indexOfArg].className = "fa-solid fa-exclamation fa-sm";

      indexOfArg++;
    }
    // location.reload();
    // console.log(`Process close with code: ${code}`);
  });
}

function addInput() {
  // Create div with search-key class and index
  const searchKeyDiv = document.createElement("div");
  searchKeyDiv.classList.add("search-key");
  searchKeyDiv.dataset.index = childrenCount;

  // Create input with all dependencies
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Business name and location";

  // Create remove button
  const removeButton = document.createElement("button");
  removeButton.id = "remove";
  removeButton.innerHTML = '<i class="fa-regular fa-trash-can fa-sm"></i>';

  // Append input and button to search-key div
  searchKeyDiv.appendChild(input);
  searchKeyDiv.appendChild(removeButton);

  // Append search-key div to search-container div
  searchContainer.appendChild(searchKeyDiv);
  childrenCount++;
}
