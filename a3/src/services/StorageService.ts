import { PANTRY_ITEMS } from "../data/pantry.js";
import { Recipe } from "../core/Recipe.js";
import { recipeFromSnapshot } from "../core/recipeFactory.js";
import type { RecipeId, RecipeSnapshot, RecipeType } from "../models/types.js";

interface StoredRecipesRecord {
  [key: string]: RecipeSnapshot;
}

export interface SavedRecipeOption {
  id: RecipeId;
  name: string;
  type: RecipeType;
}

const STORAGE_KEY = "cmpt272_recipe_builder_data";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class StorageService {
  private readAllSnapshots(): StoredRecipesRecord {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Storage data is not an object.");
      }
      return parsed as StoredRecipesRecord;
    } catch (error) {
      throw new Error(`Could not read saved recipes. ${(error as Error).message}`);
    }
  }

  private writeAllSnapshots(record: StoredRecipesRecord): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    await wait(150);

    const allRecipes = this.readAllSnapshots();
    allRecipes[recipe.id] = recipe.toSnapshot();

    try {
      this.writeAllSnapshots(allRecipes);
    } catch (error) {
      throw new Error(`Save failed. ${(error as Error).message}`);
    }
  }

  async loadRecipe(recipeId: RecipeId): Promise<Recipe> {
    await wait(150);

    const allRecipes = this.readAllSnapshots();
    const snapshot = allRecipes[recipeId];
    if (!snapshot) {
      throw new Error("Recipe not found. Please pick a valid saved recipe.");
    }

    return recipeFromSnapshot(snapshot, PANTRY_ITEMS);
  }

  async listSavedRecipes(): Promise<SavedRecipeOption[]> {
    await wait(80);

    const allRecipes = this.readAllSnapshots();
    return Object.values(allRecipes).map((snapshot) => ({
      id: snapshot.id,
      name: snapshot.name,
      type: snapshot.type
    }));
  }
}
