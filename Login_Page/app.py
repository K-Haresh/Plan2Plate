from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)


# Load Excel file
def load_excel(file_path, sheet_name):
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        return df
    except Exception as e:
        print(f"Error loading Excel: {e}")
        return None


# Process recipes
def process_recipes(df, ingredients):
    matched_recipes = []
    for index, row in df.iterrows():
        recipe_ingredients = row['NER'].split(',').map(str.strip).map(str.lower)
        user_ingredients = [i.strip().lower() for i in ingredients]

        matches = [i for i in user_ingredients if i in recipe_ingredients]
        match_percentage = len(matches) / len(recipe_ingredients) * 100 if recipe_ingredients else 0

        matched_recipes.append({
            'title': row['title'],
            'ingredients': row['ingredients'],
            'directions': row['directions'],
            'link': row['link'],
            'source': row['source'],
            'NER': row['NER'],
            'site': row['site'],
            'matchPercentage': match_percentage
        })

    # Sort by match percentage and return top 5
    matched_recipes.sort(key=lambda x: x['matchPercentage'], reverse=True)
    return matched_recipes[:5]


@app.route('/find-recipes', methods=['POST'])
def find_recipes():
    data = request.json
    ingredients = data.get('ingredients', [])
    file_path = 'recipes_data_processing.xlsx'  # Update this path
    sheet_name = 'recipes_data'  # Update this sheet name

    df = load_excel(file_path, sheet_name)
    if df is None:
        return jsonify({'error': 'Failed to load Excel file'}), 500

    recipes = process_recipes(df, ingredients)
    return jsonify(recipes)


if __name__ == '__main__':
    app.run(debug=True)
