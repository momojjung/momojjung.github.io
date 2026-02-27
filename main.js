// Enhanced ETF Data with Fees and Risk Levels
const etfData = {
  domestic: [
    { name: 'KODEX 200', category: '지수', assetClass: '주식형', growth: 12.5, '1m': 2.1, '3m': 5.4, '6m': 8.2, '1y': 15.1, volume: 4500, aum: 650000, dividend: 2.1, divCycle: '분기', popularity: 98, fee: 0.05, risk: 2 },
    { name: 'TIGER 200', category: '지수', assetClass: '주식형', growth: 12.4, '1m': 2.0, '3m': 5.3, '6m': 8.1, '1y': 15.0, volume: 3800, aum: 420000, dividend: 2.2, divCycle: '분기', popularity: 94, fee: 0.05, risk: 2 },
    { name: 'KODEX 레버리지', category: '지수', assetClass: '주식형', growth: 25.4, '1m': 4.2, '3m': 10.5, '6m': 16.2, '1y': 32.1, volume: 12000, aum: 210000, dividend: 0, divCycle: '-', popularity: 99, fee: 0.64, risk: 1 },
    { name: 'KODEX 200선물인버스2X', category: '지수', assetClass: '주식형', growth: -22.1, '1m': -4.1, '3m': -10.2, '6m': -15.8, '1y': -30.5, volume: 15000, aum: 180000, dividend: 0, divCycle: '-', popularity: 97, fee: 0.64, risk: 1 },
    { name: 'TIGER 미국나스닥100', category: '해외지수', assetClass: '주식형', growth: 25.8, '1m': 4.5, '3m': 10.2, '6m': 18.5, '1y': 32.4, volume: 3200, aum: 320000, dividend: 0.5, divCycle: '분기', popularity: 95, fee: 0.07, risk: 2 },
    { name: 'KODEX 반도체', category: '섹터', assetClass: '주식형', growth: 35.2, '1m': 8.1, '3m': 15.4, '6m': 22.1, '1y': 45.2, volume: 2800, aum: 150000, dividend: 1.2, divCycle: '연', popularity: 92, fee: 0.45, risk: 2 },
    { name: 'TIGER AI반도체핵심공정', category: '테마', assetClass: '주식형', growth: 42.5, '1m': 9.5, '3m': 21.4, '6m': 35.2, '1y': 58.7, volume: 2100, aum: 52000, dividend: 0.1, divCycle: '연', popularity: 96, fee: 0.45, risk: 2 },
    { name: 'TIGER 2차전지테마', category: '테마', assetClass: '주식형', growth: -15.4, '1m': -5.2, '3m': -8.1, '6m': -12.4, '1y': -20.5, volume: 5100, aum: 280000, dividend: 0.2, divCycle: '연', popularity: 89, fee: 0.50, risk: 2 },
    { name: 'TIGER 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.1, '1m': 1.5, '3m': 3.2, '6m': 5.8, '1y': 12.4, volume: 1500, aum: 210000, dividend: 3.8, divCycle: '월', popularity: 94, fee: 0.01, risk: 3 },
    { name: 'SOL 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.2, '1m': 1.6, '3m': 3.3, '6m': 5.9, '1y': 12.5, volume: 1100, aum: 95000, dividend: 3.9, divCycle: '월', popularity: 82, fee: 0.01, risk: 3 },
    { name: 'KODEX 단기채권', category: '채권', assetClass: '채권형', growth: 3.5, '1m': 0.3, '3m': 0.8, '6m': 1.7, '1y': 3.8, volume: 8500, aum: 450000, dividend: 3.2, divCycle: '월', popularity: 60, fee: 0.05, risk: 6 },
    { name: 'TIGER 부동산인프라고배당', category: '리츠', assetClass: '대체투자형', growth: 5.4, '1m': 1.1, '3m': 2.1, '6m': 3.5, '1y': 6.8, volume: 600, aum: 28000, dividend: 5.5, divCycle: '월', popularity: 85, fee: 0.29, risk: 4 }
  ],
  us: [
    { name: 'VYM (High Dividend Yield)', category: '고배당', assetClass: '주식형', growth: 12.5, '1m': 1.2, '3m': 4.5, '6m': 8.2, '1y': 15.8, dividend: 3.2, divCycle: '분기', fee: 0.06, risk: 3 },
    { name: 'SCHD (Dividend Equity)', category: '고배당', assetClass: '주식형', growth: 10.8, '1m': 1.5, '3m': 3.8, '6m': 7.1, '1y': 13.5, dividend: 3.4, divCycle: '분기', fee: 0.06, risk: 3 },
    { name: 'JEPI (Premium Income)', category: '매월배당', assetClass: '주식형', growth: 8.4, '1m': 0.8, '3m': 2.5, '6m': 4.8, '1y': 10.2, dividend: 7.5, divCycle: '월', fee: 0.35, risk: 4 },
    { name: 'TLT (20+ Yr Treasury)', category: '일반국채', assetClass: '채권형', growth: -8.4, '1m': -1.1, '3m': -4.2, '6m': -6.5, '1y': -12.1, dividend: 3.9, divCycle: '월', fee: 0.15, risk: 4 },
    { name: 'GLD (Gold Shares)', category: '귀금속', assetClass: '원자재형', growth: 16.5, '1m': 2.8, '3m': 4.5, '6m': 8.2, '1y': 19.4, dividend: 0, divCycle: '-', fee: 0.40, risk: 3 },
    { name: 'USO (Oil Fund)', category: '에너지', assetClass: '원자재형', growth: -12.5, '1m': -3.2, '3m': -6.8, '6m': -15.2, '1y': -22.1, dividend: 0, divCycle: '-', fee: 0.60, risk: 1 },
    { name: 'CPER (Copper)', category: '산업금속', assetClass: '원자재형', growth: 5.4, '1m': 0.8, '3m': 1.5, '6m': 3.2, '1y': 7.8, dividend: 0, divCycle: '-', fee: 0.80, risk: 2 }
  ]
};

// Benchmark Data (Mock)
const benchmarks = {
  domestic: 12.5, // KOSPI 200 YTD
  us: 18.2 // S&P 500 YTD
};

let state = {
  market: 'domestic',
  category: '인기검색',
  sortField: 'popularity',
  sortOrder: 'desc',
  searchQuery: '',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

const DOMESTIC_CATEGORIES = ['인기검색', '거래대금', '상승률', '하락률', '운용규모', '배당금'];
const US_CATEGORIES = ['고배당', '매월배당', '일반국채', '단기국채', '물가연동채', '귀금속', '에너지', '농산물', '산업금속'];
const ASSET_CATEGORIES = ['주식형', '채권형', '원자재형', '혼합자산형', '대체투자형'];

function init() {
  renderCategories();
  updateDashboard();
  setupEventListeners();
}

function updateDashboard() {
  applyCategoryLogic();
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
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

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }

  data.sort((a, b) => {
    const aFav = state.watchlist.has(a.name) ? 1 : 0;
    const bFav = state.watchlist.has(b.name) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;

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
  document.getElementById('top-div-val').textContent = `${topDiv.dividend}%`;
  document.getElementById('top-div-name').textContent = topDiv.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  const marketBenchmark = state.market === 'us' ? benchmarks.us : benchmarks.domestic;

  etfList.innerHTML = data.map(etf => {
    const isOutperforming = etf.growth > marketBenchmark;
    const riskLabel = getRiskLabel(etf.risk);
    
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
          <span class="risk-badge risk-${etf.risk}">${riskLabel}</span>
          <span class="fee-text">보수: ${etf.fee}%</span>
        </div>
        <span class="tag-market">${etf.aum ? (state.market === 'asset' ? '국내' : '') : (state.market === 'asset' ? '미국' : '')}</span>
        ${state.market === 'domestic' ? formatMetric(etf) : etf.category}
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

function formatMetric(etf) {
  switch(state.category) {
    case '거래대금': return `${etf.volume.toLocaleString()}억`;
    case '운용규모': return `${(etf.aum / 10000).toFixed(1)}조`;
    case '배당금': return `${etf.dividend}% (${etf.divCycle})`;
    default: return etf.category;
  }
}

function renderCategories() {
  const categoryPills = document.getElementById('category-pills');
  let categories = state.market === 'domestic' ? DOMESTIC_CATEGORIES : (state.market === 'us' ? US_CATEGORIES : ASSET_CATEGORIES);
  categoryPills.innerHTML = categories.map(cat => `
    <button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');
}

function applyCategoryLogic() {
  if (state.market === 'domestic') {
    switch(state.category) {
      case '인기검색': state.sortField = 'popularity'; state.sortOrder = 'desc'; break;
      case '거래대금': state.sortField = 'volume'; state.sortOrder = 'desc'; break;
      case '상승률': state.sortField = 'growth'; state.sortOrder = 'desc'; break;
      case '하락률': state.sortField = 'growth'; state.sortOrder = 'asc'; break;
      case '운용규모': state.sortField = 'aum'; state.sortOrder = 'desc'; break;
      case '배당금': state.sortField = 'dividend'; state.sortOrder = 'desc'; break;
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
      renderCategories();
      updateDashboard();
    });
  });

  document.getElementById('category-pills').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      state.category = e.target.dataset.category;
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
