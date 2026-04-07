# TailBlazer

This is a lost-animal reporting app for Assignment 4.
It uses React + TypeScript + Vite, with JSONbin for storing reports, ImgBB for storing images, and Leaflet for map.

## Setup

1. Install dependencies:

```bash
npm install
```

1. Create `.env` in the project root:

```env
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_JSONBIN_BIN_ID=your_jsonbin_bin_id
VITE_JSONBIN_MASTER_KEY='your_jsonbin_master_key'
```

*Note*: Escape (`$`) if needed

1. Start dev server:

```bash
npm run dev
```

1. Build check:

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

## AI Usage

I used ChatGPT to help me with Leaflet API usage (lat, lng).
