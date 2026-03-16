// [최종 실제 데이터 기반 보정] 국내 및 미국 ETF 정보 (2024-2025 공시 수치 반영)
let etfData = {};
let benchmarks = {};
let lastUpdateStr = '';

let state = {
  market: 'domestic',
  category: '인기검색',
  subCategory: '', // '1m', '3m', '6m', '1y' for Dividend
  sortField: 'popularity',
  sortOrder: 'desc',
  searchQuery: '',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

const DOMESTIC_CATEGORIES = ['인기검색', '거래대금', '상승률', '하락률', '운용규모', '배당금'];
const US_CATEGORIES = ['고배당', '매월배당', '일반국채', '단기국채', '귀금속', '에너지'];
const ASSET_CATEGORIES = ['주식형', '채권형', '원자재형', '혼합자산형', '대체투자형'];
const DIVIDEND_SUB_CATEGORIES = [
    { label: '1개월 배당금 상위', value: '1m' },
    { label: '3개월 배당금 상위', value: '3m' },
    { label: '6개월 배당금 상위', value: '6m' },
    { label: '1년 배당금 상위', value: '1y' }
];

async function init() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    etfData = data.etfData;
    benchmarks = data.benchmarks;
    lastUpdateStr = data.lastUpdate;
    
    renderCategories();
    updateDashboard();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load ETF data:', error);
  }
}

function updateDashboard() {
  if (!etfData.domestic) return;
  applyCategoryLogic();
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  document.getElementById('last-update-time').textContent = `마지막 업데이트: ${lastUpdateStr}`;
}

function getPeriodDividend(item, period) {
    const div = item.dividend || 0;
    const cycle = item.divCycle;
    if (!div) return 0;

    if (period === '1m') {
        return cycle === '월' ? div : 0;
    } else if (period === '3m') {
        if (cycle === '월') return div * 3;
        if (cycle === '분기') return div;
        return 0;
    } else if (period === '6m') {
        if (cycle === '월') return div * 6;
        if (cycle === '분기') return div * 2;
        return 0;
    } else if (period === '1y') {
        if (cycle === '월') return div * 12;
        if (cycle === '분기') return div * 4;
        if (cycle === '연') return div;
        return 0;
    }
    return div;
}

function getFilteredAndSortedData() {
  let data = [];
  if (state.market === 'asset') {
    data = [...etfData.domestic, ...etfData.us].filter(item => item.assetClass === state.category);
  } else {
    data = [...etfData[state.market]];
    if (state.market === 'us' || (state.market === 'domestic' && !DOMESTIC_CATEGORIES.includes(state.category))) {
      data = data.filter(item => item.category === state.category);
    }
  }

  // Filter by category for Dividend (only show stocks with dividend)
  if (state.market === 'domestic' && state.category === '배당금') {
      data = data.filter(item => item.dividend > 0);
  }

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }

  data.sort((a, b) => {
    const aFav = state.watchlist.has(a.name) ? 1 : 0;
    const bFav = state.watchlist.has(b.name) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;

    // Custom sorting for Dividend sub-categories (sort by calculated dividend amount)
    if (state.market === 'domestic' && state.category === '배당금' && state.subCategory) {
        let valA = getPeriodDividend(a, state.subCategory);
        let valB = getPeriodDividend(b, state.subCategory);
        return state.sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    let valA = a[state.sortField] || 0;
    let valB = b[state.sortField] || 0;
    return state.sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
  });

  return data;
}

function renderSummary(data) {
  if (data.length === 0) return;
  const topGainer = [...data].sort((a, b) => b['1y'] - a['1y'])[0];
  const topDiv = [...data].sort((a, b) => b.dividend - a.dividend)[0];
  const avgGrowth = (data.reduce((acc, curr) => acc + curr.growth, 0) / data.length).toFixed(1);

  document.getElementById('top-gainer-val').textContent = `${topGainer['1y']}%`;
  document.getElementById('top-gainer-name').textContent = topGainer.name;
  document.getElementById('avg-growth-val').textContent = `${avgGrowth}%`;
  
  const isDomestic = etfData.domestic.some(e => e.name === topDiv.name);
  const divSign = isDomestic ? '₩' : '$';
  document.getElementById('top-div-val').textContent = `${divSign}${topDiv.dividend}`;
  document.getElementById('top-div-name').textContent = topDiv.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  const marketBenchmark = state.market === 'us' ? benchmarks.us : benchmarks.domestic;

  etfList.innerHTML = data.map(etf => {
    const isOutperforming = etf.growth > marketBenchmark;
    const isDom = etfData.domestic.some(e => e.name === etf.name);
    const divSign = isDom ? '₩' : '$';
    
    // If sub-category is active for dividend, show the calculated amount
    let displayDividend = `${divSign}${etf.dividend}`;
    if (state.market === 'domestic' && state.category === '배당금' && state.subCategory) {
        const periodTotal = getPeriodDividend(etf, state.subCategory);
        displayDividend = `${divSign}${periodTotal.toLocaleString()} <small style="font-size:0.7em; opacity:0.7;">(${state.subCategory} 합계)</small>`;
    }

    return `
    <tr class="${state.watchlist.has(etf.name) ? 'is-fav' : ''}">
      <td class="col-fav ${state.watchlist.has(etf.name) ? 'active' : ''}" onclick="toggleWatchlist('${etf.name}')">
        ${state.watchlist.has(etf.name) ? '★' : '☆'}
      </td>
      <td>
        <div class="etf-name">
          ${etf.name}
          ${isOutperforming ? `<span class="outperform-badge" title="시장지수 상회">UP</span>` : ''}
        </div>
        <div class="growth-bar-bg">
          <div class="growth-bar-fill" style="width: ${Math.min(Math.abs(etf.growth) * 2, 100)}%; background: ${etf.growth >= 0 ? 'var(--positive)' : 'var(--negative)'}"></div>
        </div>
      </td>
      <td>
        <div class="info-group">
          <span class="risk-badge risk-${etf.risk}">${getRiskLabel(etf.risk)}</span>
          <span class="fee-text">보수: ${etf.fee}%</span>
        </div>
        <div class="dividend-row">
            <span class="div-amount">${etf.dividend > 0 ? displayDividend : '-'}</span>
            <span class="div-cycle">(${etf.divCycle})</span>
        </div>
      </td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth}%</td>
      <td class="${etf['1m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1m']}%</td>
      <td class="${etf['3m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['3m']}%</td>
      <td class="${etf['6m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['6m']}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y']}%</td>
    </tr>
  `}).join('');
}

function getRiskLabel(risk) {
  const labels = { 1: '매우높은위험', 2: '높은위험', 3: '보통위험', 4: '낮은위험', 5: '매우낮은위험', 6: '초저위험' };
  return labels[risk] || '등급없음';
}

window.toggleWatchlist = (name) => {
  if (state.watchlist.has(name)) state.watchlist.delete(name);
  else state.watchlist.add(name);
  localStorage.setItem('etf-watchlist', JSON.stringify([...state.watchlist]));
  updateDashboard();
};

function renderCategories() {
  const categoryPills = document.getElementById('category-pills');
  let categories = state.market === 'domestic' ? DOMESTIC_CATEGORIES : (state.market === 'us' ? US_CATEGORIES : ASSET_CATEGORIES);
  if (state.market === 'us') categories = ['고배당', '매월배당', '일반국채', '단기국채', '귀금속', '에너지'];

  let html = categories.map(cat => `
    <button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');

  // Add Dividend Sub-categories if "배당금" is active
  if (state.market === 'domestic' && state.category === '배당금') {
      html += `<div class="sub-pills-wrapper">` + DIVIDEND_SUB_CATEGORIES.map(sub => `
          <button class="pill sub-pill ${state.subCategory === sub.value ? 'active' : ''}" data-sub-category="${sub.value}">${sub.label}</button>
      `).join('') + `</div>`;
  }

  categoryPills.innerHTML = html;
}

function applyCategoryLogic() {
  if (state.market === 'domestic') {
    switch(state.category) {
      case '인기검색': state.sortField = 'popularity'; state.sortOrder = 'desc'; break;
      case '거래대금': state.sortField = 'volume'; state.sortOrder = 'desc'; break;
      case '상승률': state.sortField = 'growth'; state.sortOrder = 'desc'; break;
      case '하락률': state.sortField = 'growth'; state.sortOrder = 'asc'; break;
      case '운용규모': state.sortField = 'aum'; state.sortOrder = 'desc'; break;
      case '배당금': 
          // If no subCategory, default sort by cycle dividend
          state.sortField = 'dividend'; 
          state.sortOrder = 'desc'; 
          break;
    }
  } else {
    state.sortField = 'growth'; state.sortOrder = 'desc';
  }
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      state.category = state.market === 'domestic' ? '인기검색' : (state.market === 'us' ? '고배당' : '주식형');
      state.subCategory = '';
      renderCategories();
      updateDashboard();
    });
  });

  document.getElementById('category-pills').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
        if (e.target.classList.contains('sub-pill')) {
            state.subCategory = e.target.dataset.subCategory;
        } else {
            state.category = e.target.dataset.category;
            state.subCategory = ''; // Reset sub-category when main category changes
        }
      renderCategories();
      updateDashboard();
    }
  });

  document.getElementById('etf-search').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    updateDashboard();
  });

  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      state.sortOrder = (state.sortField === field && state.sortOrder === 'desc') ? 'asc' : 'desc';
      state.sortField = field;
      updateDashboard();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
