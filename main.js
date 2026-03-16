// [Naver Style Redesign] 국내 및 미국 ETF 정보 핸들링
let etfData = {};
let benchmarks = {};
let lastUpdateStr = '';

let state = {
  market: 'domestic', // 'domestic' or 'us'
  category: '전체',
  sortField: 'aum', // 시가총액(AUM) 기준 정렬
  sortOrder: 'desc',
  searchQuery: '',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

// 네이버 ETF 스타일 카테고리 (11개)
const NAVER_CATEGORIES = [
  '전체', '배당', '코스닥', '방산', 'S&P500', '나스닥100', '금', '월배당', '원유', '2차전지', '로봇'
];

async function init() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    etfData = data.etfData;
    benchmarks = data.benchmarks;
    lastUpdateStr = data.lastUpdate;
    
    updateDashboard();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load ETF data:', error);
  }
}

function updateDashboard() {
  if (!etfData.domestic) return;
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
  renderCategories();
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) lastUpdateEl.textContent = `업데이트: ${lastUpdateStr}`;
}

function getFilteredAndSortedData() {
  let data = [...etfData[state.market]];
  
  // 카테고리 필터링
  if (state.category !== '전체') {
      data = data.filter(item => item.category === state.category);
  }

  // 검색어 필터링
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }

  // 정렬 로직 (즐겨찾기 우선 + 선택 필드)
  data.sort((a, b) => {
    const aFav = state.watchlist.has(a.name) ? 1 : 0;
    const bFav = state.watchlist.has(b.name) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;

    let valA = a[state.sortField] || 0;
    let valB = b[state.sortField] || 0;
    
    if (state.sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
    } else {
        return valA < valB ? 1 : -1;
    }
  });

  return data;
}

function renderSummary(data) {
  if (data.length === 0) {
      document.getElementById('top-gainer-val').textContent = '-';
      document.getElementById('avg-growth-val').textContent = '-';
      document.getElementById('top-div-val').textContent = '-';
      return;
  }
  const topGainer = [...data].sort((a, b) => b['1y'] - a['1y'])[0];
  const topAum = [...data].sort((a, b) => b.aum - a.aum)[0];
  const avgGrowth = (data.reduce((acc, curr) => acc + curr.growth, 0) / data.length).toFixed(1);

  document.getElementById('top-gainer-val').textContent = `${topGainer['1y']}%`;
  document.getElementById('top-gainer-name').textContent = topGainer.name;
  document.getElementById('avg-growth-val').textContent = `${avgGrowth}%`;
  
  const divSign = state.market === 'domestic' ? '₩' : '$';
  document.getElementById('top-div-val').textContent = `${topAum.aum.toLocaleString()}`;
  document.getElementById('top-div-name').textContent = topAum.name;
  // Label change for top-div-val to reflect Market Cap in summary if needed, 
  // but keeping IDs for now to minimize HTML changes.
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  const isDom = state.market === 'domestic';
  const divSign = isDom ? '₩' : '$';

  etfList.innerHTML = data.map(etf => {
    const benchmark = isDom ? benchmarks.domestic : benchmarks.us;
    const isOutperforming = etf.growth > benchmark;
    
    return `
    <tr class="${state.watchlist.has(etf.name) ? 'is-fav' : ''}">
      <td class="col-fav ${state.watchlist.has(etf.name) ? 'active' : ''}" onclick="toggleWatchlist('${etf.name}')">
        ${state.watchlist.has(etf.name) ? '★' : '☆'}
      </td>
      <td>
        <div class="etf-name">
          ${etf.name}
          ${isDom ? '<span class="market-tag tag-kr">KR</span>' : '<span class="market-tag tag-us">US</span>'}
        </div>
      </td>
      <td>
        <div class="aum-text">${etf.aum.toLocaleString()}M</div>
        <div class="dividend-row">
            <span class="div-amount">${etf.dividend > 0 ? divSign + etf.dividend.toLocaleString() : '-'}</span>
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

window.toggleWatchlist = (name) => {
  if (state.watchlist.has(name)) state.watchlist.delete(name);
  else state.watchlist.add(name);
  localStorage.setItem('etf-watchlist', JSON.stringify([...state.watchlist]));
  updateDashboard();
};

function renderCategories() {
  const categoryPills = document.getElementById('category-pills');
  
  categoryPills.innerHTML = NAVER_CATEGORIES.map(cat => `
    <button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      state.category = '전체';
      updateDashboard();
    });
  });

  document.getElementById('category-pills').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      state.category = e.target.dataset.category;
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
