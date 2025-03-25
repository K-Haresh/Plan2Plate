// script.js

// Default Excel file and sheet name
let excelFile = 'recipes_data_processing.xlsx';
let sheetName = 'recipes_data'; // Replace with your actual sheet name

// Function to read the Excel file
function readExcel(file) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Check if the specified sheet exists
        if (!workbook.Sheets[sheetName]) {
            console.error("Sheet not found:", sheetName);
            alert("Sheet not found. Please check the sheet name.");
            return;
        }

        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const recipes = XLSX.utils.sheet_to_json(sheet);

        // Display the recipe of the day
        displayRecipeOfTheDay(recipes);
    };

    reader.onerror = function (event) {
        console.error("Error reading Excel file:", event);
        alert("Error reading Excel file. Please check the file path.");
    };

    reader.readAsArrayBuffer(file);
}

// Function to get today's recipe based on the current date
function getRecipeOfTheDay(recipes) {
    if (!recipes || recipes.length === 0) {
        console.error("No recipes found.");
        alert("No recipes found. Please check the Excel file.");
        return null;
    }

    const today = new Date();
    const recipeIndex = today.getDate() % recipes.length; // Rotate recipes daily
    return recipes[recipeIndex];
}

// Function to display the recipe on the webpage
function displayRecipeOfTheDay(recipes) {
    const recipe = getRecipeOfTheDay(recipes);

    if (!recipe) return;

    const recipeContainer = document.getElementById("recipe-of-the-day");

    if (!recipeContainer) {
        console.error("Recipe container not found.");
        alert("Recipe container not found. Please check the HTML.");
        return;
    }

    recipeContainer.innerHTML = `
        <div class="recipe-title">${recipe.title}</div>
        <div class="recipe-ingredients"><strong>Ingredients:</strong> ${recipe.ingredients}</div>
        <div class="recipe-directions"><strong>Directions:</strong> ${recipe.directions}</div>
        <div class="recipe-link"><strong>Link:</strong> <a href="${recipe.link}" target="_blank">${recipe.link}</a></div>
        <div class="recipe-source"><strong>Source:</strong> ${recipe.source}</div>
        <div class="recipe-ner"><strong>NER:</strong> ${recipe.NER}</div>
        <div class="recipe-site"><strong>Site:</strong> ${recipe.site}</div>
    `;
}

// Load and process the Excel file when the page loads
document.addEventListener("DOMContentLoaded", function () {
    fetch(excelFile)
        .then(response => response.blob())
        .then(blob => readExcel(blob))
        .catch(error => {
            console.error("Error loading Excel file:", error);
            alert("Error loading Excel file. Please check the file path.");
        });
});
