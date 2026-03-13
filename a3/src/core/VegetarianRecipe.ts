import { Recipe, type AddIngredientResult } from "./Recipe.js";
import type { Category, Ingredient, RecipeId, RecipeItem } from "../models/types.js";

export class VegetarianRecipe extends Recipe {
  public readonly forbiddenCategory: Category = "meat";

  constructor(id: RecipeId, name: string, items: RecipeItem[] = []) {
    super(id, name, "vegetarian", items);
  }

  canUseIngredient(ingredient: Ingredient): boolean {
    return ingredient.category !== this.forbiddenCategory;
  }

  override addIngredient(ingredient: Ingredient, grams = 100): AddIngredientResult {
    if (!this.canUseIngredient(ingredient)) {
      return {
        ok: false,
        message: `Vegetarian recipe cannot include ${ingredient.name} (${ingredient.category}).`
      };
    }

    return super.addIngredient(ingredient, grams);
  }
}
