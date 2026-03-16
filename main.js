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

const GLOBAL_MARKETS = [
  { name: 'KOSPI', val: 2650.45, change: 1.25 },
  { name: 'KOSDAQ', val: 875.12, change: -0.45 },
  { name: 'S&P 500', val: 5120.34, change: 0.85 },
  { name: 'NASDAQ', val: 16245.12, change: 1.15 },
  { name: 'FTSE 100', val: 7820.45, change: 0.32 },
  { name: 'Nikkei 225', val: 38520.12, change: 1.45 },
  { name: 'Shanghai', val: 3050.45, change: -0.12 },
  { name: 'DAX', val: 17850.32, change: 0.54 }
];

const TRENDING_NEWS = [
  { cat: '증시', title: '금리 인하 기대감에 미 증시 일제히 상승 마감' },
  { cat: '경제', title: '국내 수출 5개월 연속 플러스 행진... 반도체 견인' },
  { cat: '산업', title: '2차전지 관련주, 실적 발표 앞두고 변동성 확대' },
  { cat: '속보', title: '일본 니케이 지수 역대 최고치 경신... 엔저 효과' },
  { cat: '분석', title: '올해 ETF 투자 키워드는 "월배당"과 "AI 로봇"' }
];

async function init() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    etfData = data.etfData;
    benchmarks = data.benchmarks;
    lastUpdateStr = data.lastUpdate;
    
    // 초기 로드 시 실시간 데이터처럼 약간의 변동성 부여
    fluctuateAllData();
    
    initGlobalIndices();
    initTrendingNews();
    
    updateDashboard();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load ETF data:', error);
  }
}

function initGlobalIndices() {
  const ticker = document.getElementById('index-ticker');
  const render = () => {
    // 티커 효과를 위해 데이터를 두 번 반복
    const items = [...GLOBAL_MARKETS, ...GLOBAL_MARKETS];
    ticker.innerHTML = items.map(idx => {
      const isPos = idx.change >= 0;
      return `
        <div class="index-item">
          <span class="index-name">${idx.name}</span>
          <span class="index-val">${idx.val.toLocaleString()}</span>
          <span class="index-change" style="color: ${isPos ? 'var(--positive)' : 'var(--negative)'}">
            ${isPos ? '▲' : '▼'} ${Math.abs(idx.change)}%
          </span>
        </div>
      `;
    }).join('');
  };
  render();
}

function initTrendingNews() {
  const newsContainer = document.getElementById('trending-news');
  let currentIdx = 0;

  const renderNews = () => {
    newsContainer.innerHTML = TRENDING_NEWS.map((news, i) => `
      <div class="news-item ${i === 0 ? 'active' : ''}" style="transform: translateY(${i * 100}%)">
        <span class="news-category">[${news.cat}]</span>
        <a href="#" class="news-title">${news.title}</a>
      </div>
    `).join('');
  };

  const rotateNews = () => {
    const items = newsContainer.querySelectorAll('.news-item');
    items.forEach((item, i) => {
      item.classList.remove('active');
      let offset = (i - currentIdx);
      if (offset < 0) offset += TRENDING_NEWS.length;
      item.style.transform = `translateY(${offset * 100}%)`;
      if (offset === 0) item.classList.add('active');
    });
    currentIdx = (currentIdx + 1) % TRENDING_NEWS.length;
  };

  renderNews();
  setInterval(rotateNews, 4000);
}

// 실시간 데이터 시뮬레이션을 위한 수치 변동 함수
function fluctuate(val, range = 0.5) {
  const change = (Math.random() * 2 - 1) * range;
  return parseFloat((val + change).toFixed(2));
}

function fluctuateAllData() {
  const markets = ['domestic', 'us'];
  markets.forEach(m => {
    etfData[m] = etfData[m].map(item => ({
      ...item,
      growth: fluctuate(item.growth, 0.2),
      '1m': fluctuate(item['1m'], 0.1),
      '3m': fluctuate(item['3m'], 0.1),
      '6m': fluctuate(item['6m'], 0.1),
      '1y': fluctuate(item['1y'], 0.1),
      aum: Math.floor(item.aum * (1 + (Math.random() * 0.002 - 0.001))) // 시총 미세 변동
    }));
  });
}

function updateDashboard() {
  if (!etfData.domestic) return;
  
  // 클릭/업데이트 시마다 실시간 느낌을 주기 위해 미세 변동 적용
  fluctuateAllData();
  fluctuateGlobalIndices();
  
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
  renderCategories();
  updateLastUpdateTime();
}

function fluctuateGlobalIndices() {
  GLOBAL_MARKETS.forEach(idx => {
    idx.val = fluctuate(idx.val, idx.val * 0.001);
    idx.change = fluctuate(idx.change, 0.05);
  });
  initGlobalIndices();
}

function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    lastUpdateEl.textContent = `실시간 업데이트: ${timeStr}`;
  }
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

  // 정렬 로직 (즐겨찾기 우선 + 시가총액/선택 필드)
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
  
  const unit = state.market === 'domestic' ? '억' : 'M';
  document.getElementById('top-div-val').textContent = `${topAum.aum.toLocaleString()}${unit}`;
  document.getElementById('top-div-name').textContent = topAum.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  const isDom = state.market === 'domestic';
  const divSign = isDom ? '₩' : '$';

  etfList.innerHTML = data.map(etf => {
    const benchmark = isDom ? benchmarks.domestic : benchmarks.us;
    
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
        <div class="aum-text">${etf.aum.toLocaleString()}${isDom ? '억' : 'M'}</div>
        <div class="dividend-row">
            <span class="div-amount">${etf.dividend > 0 ? divSign + etf.dividend.toLocaleString() : '-'}</span>
            <span class="div-cycle">(${etf.divCycle})</span>
        </div>
      </td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth >= 0 ? '+' : ''}${etf.growth}%</td>
      <td class="${etf['1m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1m'] >= 0 ? '+' : ''}${etf['1m']}%</td>
      <td class="${etf['3m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['3m'] >= 0 ? '+' : ''}${etf['3m']}%</td>
      <td class="${etf['6m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['6m'] >= 0 ? '+' : ''}${etf['6m']}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y'] >= 0 ? '+' : ''}${etf['1y']}%</td>
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
