import React, { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { ChefHat } from 'lucide-react';
import { IngredientSearch } from './components/IngredientSearch';
import { RecipeCard } from './components/RecipeCard';
import { Recipe } from './types';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const { theme } = useTheme();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      return;
    }

    const generateRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-recipe`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate recipe');
        }

        setRecipes(prev => [data, ...prev]);
      } catch (error) {
        console.error('Error generating recipe:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipe';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    generateRecipe();
  }, [ingredients]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Toaster position="top-right" />
      <nav className="fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold">MunchMap</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <section className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Find recipes with ingredients you have
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enter your available ingredients and our AI chef will create delicious recipes just for you.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-2xl">
              <IngredientSearch onIngredientsChange={setIngredients} />
            </div>
          </div>

          {loading && (
            <div className="mt-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Generating your recipe...</p>
            </div>
          )}

          {recipes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">AI Generated Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {ingredients.length > 0 && recipes.length === 0 && !loading && (
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No recipes generated yet. Try adding different ingredients!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;