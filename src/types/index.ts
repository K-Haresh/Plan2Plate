export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  mealType: MealType;
  dietaryTags: DietaryTag[];
  imageUrl: string;
  authorId: string;
  createdAt: string;
  likes: number;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DietaryTag = 
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'gluten-free'
  | 'dairy-free'
  | 'paleo';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favorites: string[];
};

export type MealPlan = {
  id: string;
  userId: string;
  week: string;
  meals: {
    [key: string]: {
      breakfast?: Recipe;
      lunch?: Recipe;
      dinner?: Recipe;
      snacks?: Recipe[];
    };
  };
};

export type ShoppingList = {
  id: string;
  userId: string;
  items: ShoppingItem[];
  createdAt: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
};