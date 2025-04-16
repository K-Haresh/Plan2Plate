import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface IngredientSearchProps {
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientSearch({ onIngredientsChange }: IngredientSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && ingredients.length > 0) {
      removeIngredient(ingredients[ingredients.length - 1]);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient.toLowerCase())) {
      const newIngredients = [...ingredients, ingredient.toLowerCase()];
      setIngredients(newIngredients);
      onIngredientsChange(newIngredients);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter(i => i !== ingredient);
    setIngredients(newIngredients);
    onIngredientsChange(newIngredients);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ingredients (press Enter to add)"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        />
      </div>
      
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm",
                "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
              )}
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}