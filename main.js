// Enhanced ETF Data with Per-Share Dividend Amounts
const etfData = {
  domestic: [
    { name: 'KODEX 200', category: '지수', assetClass: '주식형', growth: 12.5, '1m': 2.1, '3m': 5.4, '6m': 8.2, '1y': 15.1, volume: 4500, aum: 650000, dividend: 45, divCycle: '분기', popularity: 98, fee: 0.05, risk: 2 },
    { name: 'TIGER 200', category: '지수', assetClass: '주식형', growth: 12.4, '1m': 2.0, '3m': 5.3, '6m': 8.1, '1y': 15.0, volume: 3800, aum: 420000, dividend: 40, divCycle: '분기', popularity: 94, fee: 0.05, risk: 2 },
    { name: 'KODEX 레버리지', category: '지수', assetClass: '주식형', growth: 25.4, '1m': 4.2, '3m': 10.5, '6m': 16.2, '1y': 32.1, volume: 12000, aum: 210000, dividend: 0, divCycle: '-', popularity: 99, fee: 0.64, risk: 1 },
    { name: 'TIGER 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.1, '1m': 1.5, '3m': 3.2, '6m': 5.8, '1y': 12.4, volume: 1500, aum: 210000, dividend: 35, divCycle: '월', popularity: 94, fee: 0.01, risk: 3 },
    { name: 'SOL 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.2, '1m': 1.6, '3m': 3.3, '6m': 5.9, '1y': 12.5, volume: 1100, aum: 95000, dividend: 33, divCycle: '월', popularity: 82, fee: 0.01, risk: 3 },
    { name: 'ARIRANG 고배당주', category: '배당', assetClass: '주식형', growth: 6.8, '1m': 1.1, '3m': 2.5, '6m': 4.1, '1y': 8.5, volume: 400, aum: 35000, dividend: 620, divCycle: '연', popularity: 55, fee: 0.23, risk: 3 },
    { name: 'KODEX 단기채권', category: '채권', assetClass: '채권형', growth: 3.5, '1m': 0.3, '3m': 0.8, '6m': 1.7, '1y': 3.8, volume: 8500, aum: 450000, dividend: 280, divCycle: '월', popularity: 60, fee: 0.05, risk: 6 },
    { name: 'TIGER 부동산인프라고배당', category: '리츠', assetClass: '대체투자형', growth: 5.4, '1m': 1.1, '3m': 2.1, '6m': 3.5, '1y': 6.8, volume: 600, aum: 28000, dividend: 42, divCycle: '월', popularity: 85, fee: 0.29, risk: 4 }
  ],
  us: [
    { name: 'VYM (High Dividend Yield)', category: '고배당', assetClass: '주식형', growth: 12.5, '1m': 1.2, '3m': 4.5, '6m': 8.2, '1y': 15.8, dividend: 0.85, divCycle: '분기', fee: 0.06, risk: 3 },
    { name: 'SCHD (Dividend Equity)', category: '고배당', assetClass: '주식형', growth: 10.8, '1m': 1.5, '3m': 3.8, '6m': 7.1, '1y': 13.5, dividend: 0.61, divCycle: '분기', fee: 0.06, risk: 3 },
    { name: 'JEPI (Premium Income)', category: '매월배당', assetClass: '주식형', growth: 8.4, '1m': 0.8, '3m': 2.5, '6m': 4.8, '1y': 10.2, dividend: 0.34, divCycle: '월', fee: 0.35, risk: 4 },
    { name: 'O (Realty Income)', category: '매월배당', assetClass: '대체투자형', growth: 5.2, '1m': -0.5, '3m': 1.2, '6m': 3.5, '1y': 6.8, dividend: 0.26, divCycle: '월', fee: 0.15, risk: 4 },
    { name: 'TLT (20+ Yr Treasury)', category: '일반국채', assetClass: '채권형', growth: -8.4, '1m': -1.1, '3m': -4.2, '6m': -6.5, '1y': -12.1, dividend: 0.31, divCycle: '월', fee: 0.15, risk: 4 },
    { name: 'GLD (Gold Shares)', category: '귀금속', assetClass: '원자재형', growth: 16.5, '1m': 2.8, '3m': 4.5, '6m': 8.2, '1y': 19.4, dividend: 0, divCycle: '-', fee: 0.40, risk: 3 }
  ]
};

const benchmarks = { domestic: 12.5, us: 18.2 };

let state = {
  market: 'domestic',
  category: '인기검색',
  sortField: 'popularity',
  sortOrder: 'desc',
  searchQuery: '',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

const DOMESTIC_CATEGORIES = ['인기검색', '거래대금', '상승률', '하락률', '운용규모', '배당금'];
const US_CATEGORIES = ['고배당', '매월배당', '일반국채', '단기국채', '귀금속', '에너지'];
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
  
  // Update Summary for Dividend with Currency
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
            <span class="div-amount">${etf.dividend > 0 ? `${divSign}${etf.dividend}` : '-'}</span>
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
