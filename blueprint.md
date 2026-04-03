# Project Blueprint: ETF Insight

## Overview
ETF Insight is a modern, framework-less web application designed to provide real-time analysis and ranking of domestic and US ETFs based on official disclosure data. It features a responsive dashboard, trending news ticker, and educational content.

## Design & Features
- **Modern UI:** Built with CSS Container Queries, Cascade Layers, and CSS Variables for a premium, tactile feel.
- **Web Components:** Encapsulated UI elements for better maintainability.
- **Real-time Data:** Fetches ETF data from `data.json` and news from Google News RSS via a proxy.
- **Multilingual Support:** Supports Korean and English.
- **Interactive Dashboard:** Filter by market and category, search by name, and sort by various metrics.
- **News Ticker:** Rotating display of major news items with links to Naver News.

## Current Plan: Fix ads.txt Recognition
1. **Standardize ads.txt:**
    - Ensured `ads.txt` follows the strictly standard format for Google AdSense (`google.com, pub-4673553755265940, DIRECT, f08c47fec0942fa0`).
2. **Configure Firebase Hosting:**
    - Updated `firebase.json` to ensure `ads.txt` is served as a static file and not rewritten to `index.html`.
    - Fixed headers to use leading slashes for `ads.txt` and `robots.txt`.
    - Adjusted `Cache-Control` for `ads.txt` to `public, max-age=3600` to improve crawler recognition.
3. **Verification:**
    - Verified `index.html` contains the correct AdSense meta tags and client ID.

## Steps Taken
- Modified `index.html` to update the news label link.
- Modified `main.js` to update sample news links.
- Updated `blueprint.md` with the latest changes.
