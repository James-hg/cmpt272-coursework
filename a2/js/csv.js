import { CatalogItem } from "./catalog-item.js";

const EXPECTED_HEADERS = [
    "title",
    "type",
    "author",
    "year",
    "genre",
    "rating",
    "description",
];

let lastParseReport = {
    errors: [],
    warnings: [],
    skippedRows: 0,
};

export function splitCsvLine(line) {
    const values = [];
    let currentValue = "";
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const nextChar = line[index + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentValue += '"';
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === "," && !inQuotes) {
            values.push(currentValue.trim());
            currentValue = "";
            continue;
        }

        currentValue += char;
    }

    values.push(currentValue.trim());
    return values;
}

export function validateHeader(headerRow) {
    if (headerRow.length !== EXPECTED_HEADERS.length) {
        return false;
    }
    return headerRow.every((column, index) => column === EXPECTED_HEADERS[index]);
}

export function parseCsvText(csvText) {
    lastParseReport = {
        errors: [],
        warnings: [],
        skippedRows: 0,
    };

    if (typeof csvText !== "string" || csvText.trim() === "") {
        lastParseReport.errors.push("The uploaded file is empty.");
        return [];
    }

    const lines = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const headerLine = lines[0] ?? "";
    const headerColumns = splitCsvLine(headerLine);

    if (headerColumns.length > 0) {
        headerColumns[0] = headerColumns[0].replace(/^\uFEFF/, "");
    }

    if (!validateHeader(headerColumns)) {
        lastParseReport.errors.push(
            "Invalid CSV header. Expected: title,type,author,year,genre,rating,description"
        );
        return [];
    }

    const items = [];
    for (let rowIndex = 1; rowIndex < lines.length; rowIndex += 1) {
        const rawLine = lines[rowIndex];
        if (!rawLine || rawLine.trim() === "") {
            continue;
        }

        const columns = splitCsvLine(rawLine);
        if (columns.length !== EXPECTED_HEADERS.length) {
            lastParseReport.warnings.push(
                `Row ${rowIndex + 1} has ${columns.length} columns and was skipped.`
            );
            lastParseReport.skippedRows += 1;
            continue;
        }

        const [title, type, author, year, genre, rating, description] = columns;
        const yearNumber = Number(year);
        const ratingNumber = Number(rating);

        if (!Number.isFinite(yearNumber) || !Number.isFinite(ratingNumber)) {
            lastParseReport.warnings.push(
                `Row ${rowIndex + 1} has invalid year/rating values and was skipped.`
            );
            lastParseReport.skippedRows += 1;
            continue;
        }

        items.push(
            new CatalogItem({
                title,
                type,
                author,
                year: yearNumber,
                genre,
                rating: ratingNumber,
                description,
            })
        );
    }

    if (items.length === 0 && lastParseReport.errors.length === 0) {
        lastParseReport.warnings.push(
            "No valid catalog items were found in the uploaded file."
        );
    }

    return items;
}

export function getLastParseReport() {
    return {
        errors: [...lastParseReport.errors],
        warnings: [...lastParseReport.warnings],
        skippedRows: lastParseReport.skippedRows,
    };
}
