# ETF Dashboard Project Blueprint (Naver Style Redesign)

## Project Overview
A comprehensive ETF dashboard redesigned to match the intuitive and data-rich format of Naver Finance's ETF section. It provides real-time-like analysis for domestic and US ETFs with specific thematic categorization and market-cap-based sorting.

## Features
- **Market Selection:** Toggle between Domestic (KR) and US ETFs.
  - *Note:* The 'KOSDAQ' category is automatically hidden when the US market is selected.
- **Thematic Categorization (Sub-tabs):**
  1.  **전체 (All):** Comprehensive list of all ETFs.
  2.  **배당 (Dividend):** High dividend yield and dividend growth ETFs.
  3.  **코스닥 (KOSDAQ):** ETFs tracking KOSDAQ indices (Domestic KR only).
  4.  **방산 (Defense):** Aerospace and defense industry ETFs.
  5.  **S&P500:** ETFs tracking the S&P 500 index.
  6.  **나스닥100 (NASDAQ 100):** ETFs tracking the NASDAQ 100 index.
  7.  **금 (Gold):** Gold spot and futures related ETFs.
  8.  **월배당 (Monthly Dividend):** ETFs providing monthly distributions.
  9.  **원유 (Crude Oil):** WTI and Brent crude oil related ETFs.
  10. **2차전지 (Secondary Battery):** Battery and EV value chain ETFs.
  11. **로봇 (Robot):** Robotics and AI automation ETFs.
- **Trending News:** Real-time news ticker with article titles.
- **News Detail Modal:** Clicking a news item opens a modal showing:
  - A 1-2 line summary of the article.
  - The direct URL to the article.
  - The news provider (source).
- **Market Cap Sorting:** Default sorting by AUM (Assets Under Management) to highlight major players.
- **Performance Metrics:** Real-time-like price changes and multi-timeframe performance.
- **Naver-style UI:** Clean, data-centric design with clear typography and professional color palette.

## Technical Stack
- **HTML5:** Semantic structure and Web Components for reusable UI.
- **CSS3:** Modern features (Container Queries, `:has()`, Flexbox/Grid, OKLCH).
- **JavaScript:** ES Modules for clean logic separation.

## Implementation Plan
1.  **Data Refinement:** Update `data.json` with a wider variety of ETFs covering all 11 categories for both KR and US markets.
2.  **UI Redesign:** 
    *   Update `index.html` for the new tab structure.
    *   Refine `style.css` for a "Naver-like" clean aesthetic.
3.  **Logic Update:**
    *   Modify `main.js` to handle the new category filtering.
    *   Set default sort to Market Cap (AUM).
    *   Implement keyword-based and attribute-based filtering for categories.
4.  **Validation:** Ensure all 11 categories work correctly for both markets and data is sorted properly.

## Current Steps
- [x] Initial Research
- [x] Redesign Plan (Blueprint Update)
- [x] Update `data.json` with comprehensive data
- [x] Implement new UI structure in `index.html`
- [x] Update `main.js` with new category logic and sorting
- [x] Refine CSS for Naver-style aesthetics
- [x] Implement News Detail Modal feature
- [ ] Final validation and testing
