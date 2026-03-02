function normalizeWhitespace(value) {
    return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeMatchValue(value) {
    return normalizeWhitespace(value).toLowerCase();
}

export class CatalogItem {
    constructor({ title, type, author, year, genre, rating, description }) {
        // trim + clean text once here so rendering/filtering stays consistent
        this.title = normalizeWhitespace(title);
        this.type = normalizeWhitespace(type);
        this.author = normalizeWhitespace(author);
        this.genre = normalizeWhitespace(genre);
        this.description = normalizeWhitespace(description);
        this.year = Number(year);
        this.rating = Number(rating);
    }

    matchesFilter({ type = "all", genre = "all" } = {}) {
        const typeFilter = normalizeMatchValue(type);
        const genreFilter = normalizeMatchValue(genre);

        // "all" means no filter on that field
        const matchesType =
            typeFilter === "all" ||
            normalizeMatchValue(this.type) === typeFilter;
        const matchesGenre =
            genreFilter === "all" ||
            normalizeMatchValue(this.genre) === genreFilter;

        return matchesType && matchesGenre;
    }

    getDetailFields() {
        return {
            title: this.title,
            subtitle: `${this.type} by ${this.author}`,
            description: this.description,
            year: this.year,
            genre: this.genre,
            rating: this.rating.toFixed(1),
            type: this.type,
            author: this.author,
        };
    }

    toCardElement() {
        // build the card with pure dom api (no template libs)
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-xl-4";

        const card = document.createElement("article");
        card.className = "card h-100 catalog-card";

        const body = document.createElement("div");
        body.className = "card-body d-flex flex-column";

        const title = document.createElement("h3");
        title.className = "card-title h5";
        title.textContent = this.title;

        const metaList = document.createElement("div");
        metaList.className = "meta-list";

        const fields = [
            ["Type", this.type],
            ["Author", this.author],
            ["Year", String(this.year)],
            ["Genre", this.genre],
            ["Rating", this.rating.toFixed(1)],
        ];

        fields.forEach(([labelText, valueText]) => {
            const label = document.createElement("p");
            label.className = "label mb-0";
            label.textContent = labelText;

            const value = document.createElement("p");
            value.className = "value";
            value.textContent = valueText;

            metaList.append(label, value);
        });

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline-primary mt-auto view-details-btn";
        button.textContent = "View details";

        body.append(title, metaList, button);
        card.appendChild(body);
        col.appendChild(card);
        return col;
    }
}
