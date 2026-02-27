# Assignment 2 - Interactive Catalog Viewer

## How to run
1. Open `/Users/jameshoang/Desktop/cmpt/sfu/cmpt272-coursework/a2/index.html` in a web browser.
2. Upload a CSV file with the required header:

`title,type,author,year,genre,rating,description`

## Features implemented
- CSV upload and parsing with `FileReader` and manual CSV parsing.
- `CatalogItem` class for data model and rendering helper methods.
- Dynamic catalog cards rendered from parsed data.
- Filter by `type` and `genre` (options generated from uploaded data).
- Sort by:
  - Year (Newest)
  - Year (Oldest)
  - Rating (High to Low)
  - Rating (Low to High)
- Item details shown in a Bootstrap modal.
- Responsive layout with Bootstrap and custom CSS.
- A1-inspired branding (header style and reused logo).

## Notes
- Invalid CSV headers show an error alert.
- Rows with invalid numeric `year` or `rating` are skipped and reported as warnings.
- This app runs fully client-side and does not require a server.

## Academic Integrity / AI Disclosure
- I used AI assistance (Codex/ChatGPT) to help scaffold structure, draft JavaScript logic, and refine styling and README wording.
- I reviewed, edited, and validated the final implementation myself.
