const searchContainer = document.getElementById("search-container");
let childrenCount = searchContainer.childElementCount;
const addInput = document.getElementById("add");

addInput.addEventListener("click", () => {
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
});

searchContainer.addEventListener("click", (event) => {
  // Remove selected search-key div
  if (event.target && event.target.id === "remove") {
    const searchKeyDiv = event.target.parentNode;
    searchKeyDiv.remove();
  }
});
