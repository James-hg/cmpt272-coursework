import type {
  Ingredient,
  IngredientId,
  Nutrition,
  RecipeId,
  RecipeItem,
  RecipeSnapshot,
  RecipeType
} from "../models/types.js";

export interface AddIngredientResult {
  ok: boolean;
  message?: string;
}

export class Recipe {
  public readonly id: RecipeId;
  public name: string;
  public readonly type: RecipeType;
  protected items: RecipeItem[];

  constructor(id: RecipeId, name: string, type: RecipeType, items: RecipeItem[] = []) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.items = items;
  }

  getItems(): RecipeItem[] {
    return [...this.items];
  }

  addIngredient(ingredient: Ingredient, grams = 100): AddIngredientResult {
    if (grams <= 0) {
      return { ok: false, message: "Grams must be greater than 0." };
    }

    const existing = this.items.find((item) => item.ingredient.id === ingredient.id);
    if (existing) {
      existing.grams += grams;
      return { ok: true };
    }

    this.items.push({ ingredient, grams });
    return { ok: true };
  }

  removeIngredient(ingredientId: IngredientId): void {
    this.items = this.items.filter((item) => item.ingredient.id !== ingredientId);
  }

  setGrams(ingredientId: IngredientId, grams: number): void {
    const item = this.items.find((entry) => entry.ingredient.id === ingredientId);
    if (!item) return;

    if (grams <= 0) {
      this.removeIngredient(ingredientId);
      return;
    }

    item.grams = grams;
  }

  getTotals(): Nutrition {
    return this.items.reduce<Nutrition>(
      (acc, item) => {
        const scale = item.grams / 100;
        acc.calories += item.ingredient.per100g.calories * scale;
        acc.protein += item.ingredient.per100g.protein * scale;
        acc.carbs += item.ingredient.per100g.carbs * scale;
        acc.fat += item.ingredient.per100g.fat * scale;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  getWarnings(): string[] {
    return [];
  }

  toSnapshot(): RecipeSnapshot {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      items: this.items.map((item) => ({
        ingredientId: item.ingredient.id,
        grams: item.grams
      }))
    };
  }
}
