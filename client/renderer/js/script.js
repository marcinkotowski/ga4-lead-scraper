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
  const inputs = Array.from(document.querySelectorAll(".search-key input"));

  const args = inputs.map((input) => input.value);

  const scrapingBot = spawn("node", ["../bot/index.js", args], {
    cwd: "../bot/",
  });

  scrapingBot.stdout.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split('"');
    const countLeads = parseInt(splitMessage[1]);
    const searchKey = splitMessage[3];

    if (countLeads > 0) {
      // succes
    } else {
      // empty
    }

    console.log(`countLeads: ${countLeads}`);
    console.log(`searchKey: ${searchKey}`);
  });

  scrapingBot.stderr.on("data", (data) => {
    const splitMessage = Buffer.from(data).toString("utf8").split(" ");
    console.log(`splitMessage: ${splitMessage}`);
    const nameFunction = splitMessage[2];
    console.log(`nameFunction: ${nameFunction}`);
  });

  // scrapingBot.on("close", (code) => {
  //   console.log(`Process close with code: ${code}`);
  // });
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
