// Install required packages: npm install axios react-bootstrap bootstrap
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [ingredients, setIngredients] = useState('');
    const [file, setFile] = useState(null);
    const [recipes, setRecipes] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !ingredients) {
            alert('Please provide both ingredients and an Excel file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'http://localhost:3000/find-recipes',
                { ingredients: ingredients.split(',').map(i => i.trim()) },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setRecipes(response.data);
        } catch (error) {
            console.error(error);
            alert('Error fetching recipes.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Recipe Finder</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="ingredients" className="form-label">Enter Ingredients (comma-separated):</label>
                    <input
                        type="text"
                        id="ingredients"
                        className="form-control"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Upload Excel File:</label>
                    <input type="file" id="file" className="form-control" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Find Recipes</button>
            </form>

            {recipes.length > 0 && (
                <div className="mt-5">
                    <h2>Top Recipes</h2>
                    <ul className="list-group">
                        {recipes.map((recipe, index) => (
                            <li key={index} className="list-group-item">
                                <h5>{recipe.title}</h5>
                                <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
                                <p><strong>Directions:</strong> {recipe.directions}</p>
                                <p><strong>Source:</strong> {recipe.source}</p>
                                <a href={recipe.link} target="_blank" rel="noopener noreferrer">View Recipe</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
