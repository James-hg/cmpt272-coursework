import { Recipe } from "./Recipe.js";
import type { RecipeId, RecipeItem } from "../models/types.js";

export class HighProteinRecipe extends Recipe {
  public minProteinRatio: number;

  constructor(id: RecipeId, name: string, items: RecipeItem[] = [], minProteinRatio = 0.3) {
    super(id, name, "highProtein", items);
    this.minProteinRatio = minProteinRatio;
  }

  getProteinRatio(): number {
    const totals = this.getTotals();
    if (totals.calories <= 0) return 0;

    // Protein is 4 kcal per gram, so this gives the protein calorie ratio.
    const proteinCalories = totals.protein * 4;
    return proteinCalories / totals.calories;
  }

  override getWarnings(): string[] {
    const warnings: string[] = [];
    const ratio = this.getProteinRatio();

    if (this.getItems().length > 0 && ratio < this.minProteinRatio) {
      warnings.push(
        `High-protein rule: protein ratio is ${(ratio * 100).toFixed(1)}%, but it should be at least ${(
          this.minProteinRatio * 100
        ).toFixed(0)}%.`
      );
    }

    return warnings;
  }
}
