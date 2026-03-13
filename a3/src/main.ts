import { createRecipe } from "./core/recipeFactory.js";
import { PANTRY_ITEMS } from "./data/pantry.js";
import { StorageService } from "./services/StorageService.js";
import { Recipe } from "./core/Recipe.js";
import type { Ingredient, RecipeType } from "./models/types.js";

const storageService = new StorageService();

let currentRecipe: Recipe = createFreshRecipe("regular");
let uiMessage = "";

const pantryBody = getEl<HTMLTableSectionElement>("pantry-body");
const recipeBody = getEl<HTMLTableSectionElement>("recipe-body");
const warningBox = getEl<HTMLDivElement>("warnings");
const recipeNameInput = getEl<HTMLInputElement>("recipe-name");
const recipeTypeSelect = getEl<HTMLSelectElement>("recipe-type");
const loadSelect = getEl<HTMLSelectElement>("load-select");
const statusMsg = getEl<HTMLParagraphElement>("status-msg");

const totalCalories = getEl<HTMLDivElement>("total-calories");
const totalProtein = getEl<HTMLDivElement>("total-protein");
const totalCarbs = getEl<HTMLDivElement>("total-carbs");
const totalFat = getEl<HTMLDivElement>("total-fat");
const recipeMeta = getEl<HTMLSpanElement>("recipe-meta");

const saveBtn = getEl<HTMLButtonElement>("save-btn");
const loadBtn = getEl<HTMLButtonElement>("load-btn");
const clearBtn = getEl<HTMLButtonElement>("clear-btn");

function getEl<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }
  return element as T;
}

function createId(): string {
  return `recipe-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function createFreshRecipe(type: RecipeType): Recipe {
  return createRecipe(type, createId(), "");
}

function getFriendlyType(type: RecipeType): string {
  switch (type) {
    case "regular":
      return "Regular";
    case "vegetarian":
      return "Vegetarian";
    case "highProtein":
      return "High Protein";
  }
}

function formatNum(value: number): string {
  return value.toFixed(1);
}

function setStatus(message: string, isError = false): void {
  statusMsg.textContent = message;
  statusMsg.classList.toggle("text-danger", isError);
  statusMsg.classList.toggle("text-success", !isError && message.length > 0);
  statusMsg.classList.toggle("text-muted", message.length === 0);
}

function buildCategoryBadge(category: string): string {
  return `<span class="badge text-bg-light border category-badge">${category}</span>`;
}

function renderPantry(): void {
  pantryBody.innerHTML = "";

  for (const ingredient of PANTRY_ITEMS) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${ingredient.name}</td>
      <td>${buildCategoryBadge(ingredient.category)}</td>
      <td>${formatNum(ingredient.per100g.calories)}</td>
      <td>${formatNum(ingredient.per100g.protein)}</td>
      <td>${formatNum(ingredient.per100g.carbs)}</td>
      <td>${formatNum(ingredient.per100g.fat)}</td>
      <td><button class="btn btn-sm btn-outline-primary">Add</button></td>
    `;

    const addBtn = row.querySelector("button");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addIngredientToRecipe(ingredient);
      });
    }

    pantryBody.appendChild(row);
  }
}

function renderRecipeItems(): void {
  recipeBody.innerHTML = "";

  const items = currentRecipe.getItems();
  if (items.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="text-muted">No ingredients yet. Add from pantry.</td>`;
    recipeBody.appendChild(row);
    return;
  }

  for (const item of items) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.ingredient.name}</td>
      <td>
        <input
          type="number"
          class="form-control form-control-sm"
          min="0"
          step="1"
          value="${item.grams}"
        />
      </td>
      <td><button class="btn btn-sm btn-outline-danger">Remove</button></td>
    `;

    const gramsInput = row.querySelector("input");
    if (gramsInput) {
      gramsInput.addEventListener("input", () => {
        const grams = Number(gramsInput.value);
        if (Number.isNaN(grams)) return;
        currentRecipe.setGrams(item.ingredient.id, grams);
        uiMessage = "";
        renderAll();
      });
    }

    const removeBtn = row.querySelector("button");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        currentRecipe.removeIngredient(item.ingredient.id);
        uiMessage = "";
        renderAll();
      });
    }

    recipeBody.appendChild(row);
  }
}

function renderTotals(): void {
  const totals = currentRecipe.getTotals();
  totalCalories.textContent = formatNum(totals.calories);
  totalProtein.textContent = formatNum(totals.protein);
  totalCarbs.textContent = formatNum(totals.carbs);
  totalFat.textContent = formatNum(totals.fat);

  recipeMeta.textContent = `${getFriendlyType(currentRecipe.type)} · ${currentRecipe.getItems().length} item(s)`;
}

function renderWarnings(): void {
  const warnings = currentRecipe.getWarnings();
  const combinedMessages = [...warnings];
  if (uiMessage) combinedMessages.unshift(uiMessage);

  warningBox.innerHTML = "";
  if (combinedMessages.length === 0) return;

  for (const warning of combinedMessages) {
    const div = document.createElement("div");
    div.className = "alert alert-warning py-2 px-3 mb-2";
    div.textContent = warning;
    warningBox.appendChild(div);
  }
}

function renderAll(): void {
  renderRecipeItems();
  renderTotals();
  renderWarnings();
}

function addIngredientToRecipe(ingredient: Ingredient): void {
  const result = currentRecipe.addIngredient(ingredient, 100);
  if (!result.ok) {
    uiMessage = result.message ?? "Could not add ingredient.";
  } else {
    uiMessage = "";
  }
  renderAll();
}

function rebuildRecipeWithType(type: RecipeType): void {
  const oldItems = currentRecipe.getItems();
  const previousName = recipeNameInput.value.trim();

  currentRecipe = createRecipe(type, createId(), previousName);
  for (const item of oldItems) {
    const addResult = currentRecipe.addIngredient(item.ingredient, item.grams);
    if (!addResult.ok) {
      uiMessage = addResult.message ?? "Some items could not be transferred to this recipe type.";
    }
  }

  renderAll();
}

async function refreshLoadDropdown(): Promise<void> {
  const recipes = await storageService.listSavedRecipes();

  loadSelect.innerHTML = `<option value="">-- select saved recipe --</option>`;
  for (const saved of recipes) {
    const option = document.createElement("option");
    option.value = saved.id;
    option.textContent = `${saved.name || "(untitled)"} (${getFriendlyType(saved.type)})`;
    loadSelect.appendChild(option);
  }
}

saveBtn.addEventListener("click", async () => {
  try {
    const name = recipeNameInput.value.trim();
    if (name.length === 0) {
      setStatus("Recipe name is required before saving.", true);
      return;
    }

    currentRecipe.name = name;
    await storageService.saveRecipe(currentRecipe);
    await refreshLoadDropdown();
    setStatus("Recipe saved.");
  } catch (error) {
    setStatus((error as Error).message, true);
  }
});

loadBtn.addEventListener("click", async () => {
  const selectedId = loadSelect.value;
  if (!selectedId) {
    setStatus("Please select a saved recipe first.", true);
    return;
  }

  try {
    const loadedRecipe = await storageService.loadRecipe(selectedId);
    currentRecipe = loadedRecipe;
    recipeNameInput.value = loadedRecipe.name;
    recipeTypeSelect.value = loadedRecipe.type;
    uiMessage = "";
    renderAll();
    setStatus("Recipe loaded.");
  } catch (error) {
    setStatus((error as Error).message, true);
  }
});

clearBtn.addEventListener("click", () => {
  currentRecipe = createFreshRecipe(recipeTypeSelect.value as RecipeType);
  recipeNameInput.value = "";
  uiMessage = "";
  setStatus("");
  renderAll();
});

recipeTypeSelect.addEventListener("change", () => {
  const nextType = recipeTypeSelect.value as RecipeType;
  rebuildRecipeWithType(nextType);
});

recipeNameInput.addEventListener("input", () => {
  currentRecipe.name = recipeNameInput.value;
});

async function init(): Promise<void> {
  renderPantry();
  renderAll();
  try {
    await refreshLoadDropdown();
  } catch (error) {
    setStatus(`Could not load saved recipe list. ${(error as Error).message}`, true);
  }
}

void init();
