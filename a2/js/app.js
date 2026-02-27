import { parseCsvText, getLastParseReport } from "./csv.js";

const elements = {
    fileInput: document.querySelector("#csvFileInput"),
    typeFilter: document.querySelector("#typeFilter"),
    genreFilter: document.querySelector("#genreFilter"),
    sortOrder: document.querySelector("#sortOrder"),
    resetButton: document.querySelector("#resetControls"),
    statusAlert: document.querySelector("#statusAlert"),
    resultsCount: document.querySelector("#resultsCount"),
    catalogGrid: document.querySelector("#catalogGrid"),
    detailModal: document.querySelector("#detailModal"),
    detailTitle: document.querySelector("#detailModalLabel"),
    detailSubtitle: document.querySelector("#detailSubtitle"),
    detailDescription: document.querySelector("#detailDescription"),
    detailType: document.querySelector("#detailType"),
    detailAuthor: document.querySelector("#detailAuthor"),
    detailYear: document.querySelector("#detailYear"),
    detailGenre: document.querySelector("#detailGenre"),
    detailRating: document.querySelector("#detailRating"),
};

let allItems = [];
let detailModalInstance = null;
let hasLoadedFile = false;

function setControlsEnabled(enabled) {
    elements.typeFilter.disabled = !enabled;
    elements.genreFilter.disabled = !enabled;
    elements.sortOrder.disabled = !enabled;
    elements.resetButton.disabled = !enabled;
}

function setAlert(message, level = "info") {
    if (!message) {
        elements.statusAlert.textContent = "";
        elements.statusAlert.className = "d-none";
        return;
    }

    elements.statusAlert.textContent = message;
    elements.statusAlert.className = `alert alert-${level}`;
}

function createEmptyState(message) {
    const wrap = document.createElement("div");
    wrap.className = "col-12";

    const box = document.createElement("div");
    box.className = "empty-state";
    box.textContent = message;

    wrap.appendChild(box);
    return wrap;
}

function getUniqueValues(items, key) {
    const map = new Map();
    items.forEach((item) => {
        const raw = String(item[key] ?? "").trim();
        if (!raw) {
            return;
        }
        const normalized = raw.toLowerCase();
        if (!map.has(normalized)) {
            map.set(normalized, raw);
        }
    });
    return [...map.values()].sort((left, right) => left.localeCompare(right));
}

function updateSelectOptions(selectElement, items, key, allLabel) {
    selectElement.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = allLabel;
    selectElement.appendChild(allOption);

    getUniqueValues(items, key).forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

function sortItems(items, sortOrder) {
    const sorted = [...items];
    sorted.sort((left, right) => {
        if (sortOrder === "year-asc") {
            return left.year - right.year || left.title.localeCompare(right.title);
        }
        if (sortOrder === "year-desc") {
            return right.year - left.year || left.title.localeCompare(right.title);
        }
        if (sortOrder === "rating-asc") {
            return (
                left.rating - right.rating || left.title.localeCompare(right.title)
            );
        }
        if (sortOrder === "rating-desc") {
            return (
                right.rating - left.rating || left.title.localeCompare(right.title)
            );
        }
        return left.title.localeCompare(right.title);
    });
    return sorted;
}

function renderItems(items) {
    elements.catalogGrid.innerHTML = "";
    if (items.length === 0) {
        elements.catalogGrid.appendChild(
            createEmptyState("No items match the selected filters.")
        );
        return;
    }

    items.forEach((item) => {
        const cardElement = item.toCardElement();
        const button = cardElement.querySelector(".view-details-btn");
        if (button) {
            button.addEventListener("click", () => openDetailsModal(item));
        }
        elements.catalogGrid.appendChild(cardElement);
    });
}

function updateResultsCount(displayedCount, totalCount) {
    elements.resultsCount.textContent = `${displayedCount} of ${totalCount} item${
        totalCount === 1 ? "" : "s"
    }`;
}

export function populateFilterOptions(items) {
    updateSelectOptions(elements.typeFilter, items, "type", "All types");
    updateSelectOptions(elements.genreFilter, items, "genre", "All genres");
}

export function openDetailsModal(item) {
    const details = item.getDetailFields();
    elements.detailTitle.textContent = details.title;
    elements.detailSubtitle.textContent = details.subtitle;
    elements.detailDescription.textContent = details.description;
    elements.detailType.textContent = details.type;
    elements.detailAuthor.textContent = details.author;
    elements.detailYear.textContent = String(details.year);
    elements.detailGenre.textContent = details.genre;
    elements.detailRating.textContent = details.rating;

    if (!detailModalInstance) {
        detailModalInstance = new bootstrap.Modal(elements.detailModal);
    }
    detailModalInstance.show();
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Could not read the uploaded file."));
        reader.readAsText(file);
    });
}

function resetControlValues() {
    elements.typeFilter.value = "all";
    elements.genreFilter.value = "all";
    elements.sortOrder.value = "year-desc";
}

export function applyViewState() {
    if (allItems.length === 0) {
        elements.catalogGrid.innerHTML = "";
        elements.catalogGrid.appendChild(
            createEmptyState(
                hasLoadedFile
                    ? "No valid catalog items are available to display."
                    : "Upload a CSV file to display catalog items."
            )
        );
        updateResultsCount(0, 0);
        return;
    }

    const type = elements.typeFilter.value;
    const genre = elements.genreFilter.value;
    const sortOrder = elements.sortOrder.value;

    const filtered = allItems.filter((item) => item.matchesFilter({ type, genre }));
    const sorted = sortItems(filtered, sortOrder);

    renderItems(sorted);
    updateResultsCount(sorted.length, allItems.length);
}

export async function loadFile(file) {
    try {
        hasLoadedFile = true;
        const fileText = await readFileAsText(file);
        const parsedItems = parseCsvText(fileText);
        const report = getLastParseReport();

        if (report.errors.length > 0) {
            allItems = [];
            populateFilterOptions([]);
            setControlsEnabled(false);
            applyViewState();
            setAlert(report.errors.join(" "), "danger");
            return;
        }

        allItems = parsedItems;
        populateFilterOptions(allItems);
        resetControlValues();
        setControlsEnabled(allItems.length > 0);
        applyViewState();

        if (report.warnings.length > 0) {
            setAlert(report.warnings.join(" "), "warning");
        } else {
            setAlert(
                `Loaded ${allItems.length} item${
                    allItems.length === 1 ? "" : "s"
                } successfully.`,
                "success"
            );
        }
    } catch (error) {
        allItems = [];
        populateFilterOptions([]);
        setControlsEnabled(false);
        applyViewState();
        setAlert(error.message, "danger");
    }
}

function init() {
    applyViewState();
    setControlsEnabled(false);

    elements.fileInput.addEventListener("change", async (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            return;
        }
        await loadFile(selectedFile);
    });

    [elements.typeFilter, elements.genreFilter, elements.sortOrder].forEach(
        (control) => {
            control.addEventListener("change", applyViewState);
        }
    );

    elements.resetButton.addEventListener("click", () => {
        resetControlValues();
        applyViewState();
    });
}

init();
