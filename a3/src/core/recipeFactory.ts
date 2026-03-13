import { HighProteinRecipe } from "./HighProteinRecipe.js";
import { Recipe } from "./Recipe.js";
import { VegetarianRecipe } from "./VegetarianRecipe.js";
import type { Ingredient, RecipeSnapshot, RecipeType } from "../models/types.js";

function assertNever(x: never): never {
  throw new Error(`Unhandled recipe type: ${String(x)}`);
}

export function createRecipe(type: RecipeType, id: string, name: string): Recipe {
  switch (type) {
    case "regular":
      return new Recipe(id, name, "regular");
    case "vegetarian":
      return new VegetarianRecipe(id, name);
    case "highProtein":
      return new HighProteinRecipe(id, name);
    default:
      return assertNever(type);
  }
}

export function recipeFromSnapshot(snapshot: RecipeSnapshot, pantry: Ingredient[]): Recipe {
  const recipe = createRecipe(snapshot.type, snapshot.id, snapshot.name);

  for (const snapshotItem of snapshot.items) {
    const ingredient = pantry.find((entry) => entry.id === snapshotItem.ingredientId);
    if (!ingredient) {
      // If pantry data changed, we skip unknown ingredient instead of crashing.
      continue;
    }
    recipe.addIngredient(ingredient, snapshotItem.grams);
  }

  return recipe;
}
