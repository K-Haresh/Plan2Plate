// Install required packages: npm install express multer xlsx cors
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Endpoint to process ingredients and return recipes
app.post('/find-recipes', upload.single('file'), (req, res) => {
    const { ingredients } = req.body;
    const filePath = req.file.path;

    // Load Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process recipes
    const matchedRecipes = sheetData.map(recipe => {
        const recipeIngredients = recipe.NER.split(',').map(i => i.trim().toLowerCase());
        const userIngredients = ingredients.map(i => i.toLowerCase());

        // Calculate match percentage
        const matches = userIngredients.filter(ingredient => recipeIngredients.includes(ingredient));
        const matchPercentage = (matches.length / recipeIngredients.length) * 100;

        return { ...recipe, matchPercentage };
    });

    // Sort by match percentage and return top 5
    matchedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topRecipes = matchedRecipes.slice(0, 5);

    res.json(topRecipes);
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
