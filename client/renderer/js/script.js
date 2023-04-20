const { spawn } = require("child_process");
const { shell } = require("electron");
const { type } = require("os");
const path = require("path");

const searchContainer = document.getElementById("search-container");
let childrenCount = searchContainer.childElementCount;
const addButton = document.getElementById("add");
const botOptionContainer = document.getElementById("bot-option-container");
const runButton = botOptionContainer.querySelector("#run");
const savedButton = document.getElementById("saved");

addButton.addEventListener("click", addInput);
runButton.addEventListener("click", runScrapingBot);

let unviewedFile = parseInt(localStorage.getItem("unviewedFile")) || 0;
const newFilesDiv = document.getElementById("new-files");
if (unviewedFile !== 0) newFilesDiv.style.display = "flex";

savedButton.addEventListener("click", () => {
  resetUnviewedFile();

  const savedPath = path.join(__dirname, "../../bot/results/");
  shell.openPath(savedPath);
});

searchContainer.addEventListener("click", (event) => {
  // Remove selected search-key div
  if (event.target && event.target.id === "remove") {
    const searchKeyDiv = event.target.parentNode;
    searchKeyDiv.remove();
  }
});

function resetUnviewedFile() {
  unviewedFile = 0;
  localStorage.setItem("unviewedFile", unviewedFile);
  newFilesDiv.style.display = "none";
}

function newUnviewedFile() {
  unviewedFile = 1;
  localStorage.setItem("unviewedFile", unviewedFile);
  newFilesDiv.style.display = "flex";
}

let lastSucceedScrap = 0;

function runScrapingBot() {
  const searchKeys = Array.from(document.querySelectorAll(".search-key"));

  /* Destructure searchKeys DOM element */
  let inputsValue = [];
  let buttons = [];
  let icons = [];

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

  const isTryAgain = botOptionContainer.querySelector("#clear");

  if (!isTryAgain) {
    botOptionContainer.removeChild(runButton);

    var createdTryAgainButton = document.createElement("button");
    createdTryAgainButton.className = "bot";
    createdTryAgainButton.innerText = "Try again";

    var createdClearInputButton = document.createElement("button");
    createdClearInputButton.id = "clear";
    createdClearInputButton.className = "bot";
    createdClearInputButton.innerText = "Clear inputs";
  } else {
    var tryAgainButton = botOptionContainer.querySelector(".bot");
    var clearInputButton = botOptionContainer.querySelector("#clear");
    tryAgainButton.style.display = "none";
    clearInputButton.style.display = "none";
  }

  const inProgressText = document.createElement("p");
  inProgressText.innerText = "Scraping in progress";

  botOptionContainer.appendChild(inProgressText);

  let indexOfArg = 0;
  let currentSucceedScrap = 0;

  scrapingBot.stdout.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split('"');
    const countLeads = parseInt(splitMessage[1]);
    // console.log("stdout", splitMessage);
    // const searchKey = splitMessage[3];

    if (countLeads > 0) {
      buttons[indexOfArg].id = "success";
      icons[indexOfArg].className = "fa-solid fa-check fa-sm";

      currentSucceedScrap++;
    } else {
      buttons[indexOfArg].id = "empty";
      icons[indexOfArg].className = "fa-solid fa-shop-slash fa-sm";
    }

    indexOfArg++;
    // console.log(`countLeads: ${countLeads}`);
    // console.log(`searchKey: ${searchKey}`);
  });

  scrapingBot.stderr.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split("\n");
    const arg = splitMessage[0].split('"')[1];
    // console.log("stderr", splitMessage);

    buttons[indexOfArg].id = "error";
    icons[indexOfArg].className = "fa-solid fa-exclamation fa-sm";

    if (arg) indexOfArg++;
  });

  scrapingBot.on("close", (code) => {
    while (indexOfArg != inputsValue.length) {
      buttons[indexOfArg].id = "error";
      icons[indexOfArg].className = "fa-solid fa-exclamation fa-sm";

      indexOfArg++;
    }

    botOptionContainer.removeChild(inProgressText);

    if (!isTryAgain) {
      botOptionContainer.appendChild(createdTryAgainButton);
      botOptionContainer.appendChild(createdClearInputButton);

      createdTryAgainButton.addEventListener("click", () => {
        runScrapingBot();
      });
      createdClearInputButton.addEventListener("click", () => {
        location.reload();
        lastSucceedScrap = 0;
      });

      if (currentSucceedScrap !== 0) newUnviewedFile();
    } else {
      if (unviewedFile === 0 && currentSucceedScrap !== 0) {
        newUnviewedFile();
      } else if (currentSucceedScrap > lastSucceedScrap) {
        newUnviewedFile();
      }

      tryAgainButton.style.display = "block";
      clearInputButton.style.display = "block";
    }

    lastSucceedScrap = currentSucceedScrap;

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
