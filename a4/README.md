# TailBlazer (Simplified)

This is a simplified frontend-only lost-animal reporting app for Assignment 4.  
It uses React + TypeScript + Vite, JSONbin for report storage, ImgBB for image hosting, and Leaflet for map interaction.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the project root:

```env
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_JSONBIN_BIN_ID=your_jsonbin_bin_id
VITE_JSONBIN_MASTER_KEY='your_jsonbin_master_key'
```

If your JSONbin key starts with `$`, keep it quoted (or escape each `$`).

3. Start dev server:

```bash
npm run dev
```

4. Build check:

```bash
npm run build
```

## JSONbin Initial Record

Use this JSON in the bin before first run:

```json
{
  "reports": []
}
```

## Notes

- This version keeps the code minimal and intentionally uses plaintext password compare for the "mark as found" flow.
- That plaintext approach was requested for simplification, but it does conflict with the assignment requirement that asks for password hashing.

## AI Usage Disclosure

AI tooling was used for scaffolding, implementation support, and refactoring.  
All output was reviewed and adjusted to match the assignment scope and a simpler second-year coding style.
