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

## Current Plan: Update News Links & Deploy
1. **Update News Path:**
    - Changed the "Real-time Major News" label link from Naver Finance News (`finance.naver.com/news/`) to Naver News Home (`news.naver.com/`) in `index.html`.
    - Updated sample news URLs in `main.js` to point to Naver News Home.
2. **Deployment:**
    - Prepare and commit changes.
    - Deploy the project to `https://github.com/momojjung/momojjung.github.io` by pushing to the `deploy` remote.

## Steps Taken
- Modified `index.html` to update the news label link.
- Modified `main.js` to update sample news links.
- Updated `blueprint.md` with the latest changes.
