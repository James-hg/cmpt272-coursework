export type IngredientId = string;
export type RecipeId = string;

export type Category =
  | "meat"
  | "protein"
  | "vegetable"
  | "grain"
  | "dairy"
  | "fat"
  | "fruit"
  | "spice"
  | "other";

export type RecipeType = "regular" | "vegetarian" | "highProtein";

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Ingredient {
  id: IngredientId;
  name: string;
  category: Category;
  per100g: Nutrition;
}

export interface RecipeItem {
  ingredient: Ingredient;
  grams: number;
}

export interface RecipeSnapshot {
  id: RecipeId;
  name: string;
  type: RecipeType;
  items: Array<{
    ingredientId: IngredientId;
    grams: number;
  }>;
}
