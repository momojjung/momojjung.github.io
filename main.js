// [Naver Style Redesign] 국내 및 미국 ETF 정보 핸들링
let etfData = {};
let benchmarks = {};
let lastUpdateStr = '';

let state = {
  market: 'domestic',
  category: '전체',
  sortField: 'aum',
  sortOrder: 'desc',
  searchQuery: '',
  lang: 'ko',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

const TRANSLATIONS = {
  ko: {
    'nav-dashboard': '분석 대시보드',
    'nav-tools': '투자 도구',
    'nav-academy': 'ETF 아카데미',
    'nav-glossary': '용어 사전',
    'nav-about': '사이트 소개',
    'header-title': '스마트한 ETF 투자의 시작',
    'header-subtitle': '공식 공시 데이터 기반의 투명한 ETF 성과 분석 및 투자 시뮬레이션 플랫폼',
    'etf-search-placeholder': '종목명 또는 티커 검색...',
    'news-label': '실시간 주요 뉴스',
    'label-top-gainer': '최고 수익률 (1년)',
    'label-avg-growth': '카테고리 평균 수익률',
    'label-filter-base': '현재 필터 기준',
    'label-max-aum': '최대 시가총액',
    'market-domestic': '국내 ETF',
    'market-us': '미국 ETF',
    'market-cap-notice': '** 시가총액 상위 기준 **',
    'th-name': '종목명',
    'th-aum': '시가총액 / 배당금',
    'th-growth': '성장률 (YTD)',
    'th-1m': '1개월',
    'th-3m': '3개월',
    'th-6m': '6개월',
    'th-1y': '1년',
    'unit-aum-kr': '억',
    'unit-aum-us': 'M',
    'categories': {
      '전체': '전체', '배당': '배당', '코스닥': '코스닥', '방산': '방산', 'S&P500': 'S&P500', 
      '나스닥100': '나스닥100', '금': '금', '월배당': '월배당', '원유': '원유', '2차전지': '2차전지', '로봇': '로봇'
    },
    'news-cats': { '증시': '증시', '경제': '경제', '산업': '산업', '속보': '속보', '분석': '분석' }
  },
  en: {
    'nav-dashboard': 'Dashboard',
    'nav-tools': 'Tools',
    'nav-academy': 'Academy',
    'nav-glossary': 'Glossary',
    'nav-about': 'About',
    'header-title': 'Smart ETF Investing Starts Here',
    'header-subtitle': 'Transparent ETF Analysis Platform Based on Official Disclosures',
    'etf-search-placeholder': 'Search Name or Ticker...',
    'news-label': 'Trending News',
    'label-top-gainer': 'Top Gainer (1Y)',
    'label-avg-growth': 'Category Avg Growth',
    'label-filter-base': 'Current Filter',
    'label-max-aum': 'Max Market Cap',
    'market-domestic': 'Domestic ETF',
    'market-us': 'US ETF',
    'market-cap-notice': '** Sorted by Market Cap **',
    'th-name': 'Name',
    'th-aum': 'Market Cap / Dividend',
    'th-growth': 'Growth (YTD)',
    'th-1m': '1 Month',
    'th-3m': '3 Months',
    'th-6m': '6 Months',
    'th-1y': '1 Year',
    'unit-aum-kr': 'B KRW',
    'unit-aum-us': 'M USD',
    'categories': {
      '전체': 'All', '배당': 'Dividend', '코스닥': 'KOSDAQ', '방산': 'Defense', 'S&P500': 'S&P500', 
      '나스닥100': 'NASDAQ 100', '금': 'Gold', '월배당': 'Monthly Div', '원유': 'Crude Oil', '2차전지': 'Battery', '로봇': 'Robot'
    },
    'news-cats': { '증시': 'Market', '경제': 'Economy', '산업': 'Industry', '속보': 'Breaking', '분석': 'Analysis' }
  }
};

const NAVER_CATEGORIES = ['전체', '배당', '코스닥', '방산', 'S&P500', '나스닥100', '금', '월배당', '원유', '2차전지', '로봇'];

let LIVE_NEWS = [
  { cat: '증시', title: '금리 동결 전망에 기술주 중심 반등세 지속', url: 'https://news.naver.com/' },
  { cat: '경제', title: '환율 변동성 확대... 수출입 기업 대응 부심', url: 'https://news.naver.com/' },
  { cat: '산업', title: 'AI 반도체 수요 폭증, 관련 기업 실적 개선 기대', url: 'https://news.naver.com/' },
  { cat: '속보', title: '주요 지수 최고치 경신 후 혼조세 마감', url: 'https://news.naver.com/' }
];

function getCurrentFormattedTime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

async function init() {
  lastUpdateStr = getCurrentFormattedTime();
  updateMagazineDates();

  initTrendingNews();
  fetchRealTimeNews();
  
  setupEventListeners();
  setupToolEventListeners();

  const cachedEtfData = localStorage.getItem('cached-etf-data');
  if (cachedEtfData) {
    try {
      const dataRes = JSON.parse(cachedEtfData);
      etfData = dataRes.etfData;
      benchmarks = dataRes.benchmarks;
      updateDashboard();
      populateCompareSelects();
    } catch (e) { console.warn('Cached ETF data parse failed'); }
  }

  fetch('data.json?t=' + Date.now())
    .then(res => res.json())
    .then(dataRes => {
      etfData = dataRes.etfData;
      benchmarks = dataRes.benchmarks;
      lastUpdateStr = getCurrentFormattedTime();
      localStorage.setItem('cached-etf-data', JSON.stringify(dataRes));
      updateDashboard();
      populateCompareSelects();
    })
    .catch(error => console.error('ETF data fetch failed:', error));
}

// Investment Tools Logic
function setupToolEventListeners() {
  const quantityInput = document.getElementById('calc-quantity');
  const dividendInput = document.getElementById('calc-dividend');
  const resultValue = document.getElementById('calc-result');

  const updateCalc = () => {
    const q = parseFloat(quantityInput.value) || 0;
    const d = parseFloat(dividendInput.value) || 0;
    const res = q * d;
    resultValue.textContent = res.toLocaleString();
  };

  quantityInput.addEventListener('input', updateCalc);
  dividendInput.addEventListener('input', updateCalc);

  document.getElementById('compare-1').addEventListener('change', updateComparison);
  document.getElementById('compare-2').addEventListener('change', updateComparison);
}

function populateCompareSelects() {
  const s1 = document.getElementById('compare-1');
  const s2 = document.getElementById('compare-2');
  if (!s1 || !s2 || !etfData.domestic) return;

  const allEtfs = [...etfData.domestic, ...etfData.us];
  const options = allEtfs.map(e => `<option value="${e.name}">${e.name}</option>`).join('');
  
  s1.innerHTML = `<option value="">선택 1</option>` + options;
  s2.innerHTML = `<option value="">선택 2</option>` + options;
}

function updateComparison() {
  const name1 = document.getElementById('compare-1').value;
  const name2 = document.getElementById('compare-2').value;
  const grid = document.getElementById('compare-result-grid');

  if (!name1 || !name2) {
    grid.innerHTML = '<div class="compare-placeholder">비교할 두 종목을 선택해 주세요.</div>';
    return;
  }

  const allEtfs = [...etfData.domestic, ...etfData.us];
  const e1 = allEtfs.find(e => e.name === name1);
  const e2 = allEtfs.find(e => e.name === name2);

  const fields = [
    { label: '성장률 (YTD)', key: 'growth', suffix: '%' },
    { label: '1년 수익률', key: '1y', suffix: '%' },
    { label: '3개월 수익률', key: '3m', suffix: '%' },
    { label: '배당금', key: 'dividend', suffix: '' }
  ];

  grid.innerHTML = fields.map(f => `
    <div class="compare-row">
      <div class="compare-val ${e1[f.key] > e2[f.key] ? 'val-positive' : ''}">${e1[f.key]}${f.suffix}</div>
      <div class="compare-label">${f.label}</div>
      <div class="compare-val ${e2[f.key] > e1[f.key] ? 'val-positive' : ''}">${e2[f.key]}${f.suffix}</div>
    </div>
  `).join('');
}

// 구글 뉴스 RSS Fetch 로직 강화
async function fetchRealTimeNews() {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=ETF+주식+증시&hl=ko&gl=KR&ceid=KR:ko&t=${Date.now()}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (!data.contents) throw new Error('Empty news contents');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = xmlDoc.querySelectorAll("item");
    
    if (items.length === 0) throw new Error('No news items found');

    const newsList = [];
    items.forEach((item, index) => {
      if (index < 10) {
        const title = item.querySelector("title")?.textContent || "뉴스를 불러올 수 없습니다.";
        const link = item.querySelector("link")?.textContent || "#";
        newsList.push({
          cat: index % 2 === 0 ? '증시' : '경제',
          title: title.split(' - ')[0],
          url: link
        });
      }
    });

    if (newsList.length > 0) {
      LIVE_NEWS = newsList;
      initTrendingNews();
    }
  } catch (error) {
    console.warn('Real-time news fetch failed, using fallback:', error);
  }
}

function updateMagazineDates() {
  const now = new Date();
  const dateElements = document.querySelectorAll('.magazine-footer .date');
  dateElements.forEach((el, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() - index);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    el.textContent = `${y}.${m}.${day}`;
  });
}

function initTrendingNews() {
  const newsContainer = document.getElementById('trending-news');
  if (!newsContainer) return;
  const tCats = TRANSLATIONS[state.lang]['news-cats'];
  let currentIdx = 0;

  const renderNews = () => {
    newsContainer.innerHTML = '';
    LIVE_NEWS.forEach((news, i) => {
      const item = document.createElement('div');
      item.className = `news-item ${i === 0 ? 'active' : ''}`;
      item.style.transform = `translateY(${i * 100}%)`;
      item.innerHTML = `<span class="news-category">[${tCats[news.cat] || news.cat}]</span> <span class="news-title">${news.title}</span>`;
      item.addEventListener('click', () => { window.open(news.url, '_blank'); });
      newsContainer.appendChild(item);
    });
  };

  const rotateNews = () => {
    const items = newsContainer.querySelectorAll('.news-item');
    if (items.length === 0) return;
    items.forEach((item, i) => {
      item.classList.remove('active');
      let offset = (i - currentIdx);
      if (offset < 0) offset += LIVE_NEWS.length;
      item.style.transform = `translateY(${offset * 100}%)`;
      if (offset === 0) item.classList.add('active');
    });
    currentIdx = (currentIdx + 1) % LIVE_NEWS.length;
  };

  renderNews();
  if (window.newsInterval) clearInterval(window.newsInterval);
  window.newsInterval = setInterval(rotateNews, 4000);
}

function updateDashboard() {
  if (!etfData || !etfData.domestic) return;
  applyTranslations();
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
  renderCategories();
  updateLastUpdateTime();
}

function applyTranslations() {
  const t = TRANSLATIONS[state.lang];
  Object.keys(t).forEach(key => {
    const el = document.getElementById(key);
    if (el) {
      if (key === 'etf-search-placeholder') {
        const input = document.getElementById('etf-search');
        if (input) input.placeholder = t[key];
      } else { el.textContent = t[key]; }
    }
  });
}

function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) {
    const prefix = state.lang === 'ko' ? '데이터 기준' : 'Data as of';
    lastUpdateEl.textContent = `${prefix}: ${lastUpdateStr || '---'}`;
  }
}

function getFilteredAndSortedData() {
  if (!etfData[state.market]) return [];
  let data = [...etfData[state.market]];
  if (state.category !== '전체') { data = data.filter(item => item.category === state.category); }
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
    return state.sortOrder === 'asc' ? (valA - valB) : (valB - valA);
  });
  return data;
}

function renderSummary(data) {
  if (!data || data.length === 0) return;
  const topGainer = [...data].sort((a, b) => b['1y'] - a['1y'])[0];
  const topAum = [...data].sort((a, b) => b.aum - a.aum)[0];
  const avgGrowth = (data.reduce((acc, curr) => acc + curr.growth, 0) / data.length).toFixed(1);
  document.getElementById('top-gainer-val').textContent = `${topGainer['1y']}%`;
  document.getElementById('top-gainer-name').textContent = topGainer.name;
  document.getElementById('avg-growth-val').textContent = `${avgGrowth}%`;
  const unit = TRANSLATIONS[state.lang][state.market === 'domestic' ? 'unit-aum-kr' : 'unit-aum-us'];
  document.getElementById('top-div-val').textContent = `${topAum.aum.toLocaleString()}${unit}`;
  document.getElementById('top-div-name').textContent = topAum.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  if (!etfList) return;
  const isDom = state.market === 'domestic';
  const unit = TRANSLATIONS[state.lang][isDom ? 'unit-aum-kr' : 'unit-aum-us'];
  if (data.length === 0) {
    etfList.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;">No results found.</td></tr>';
    return;
  }
  
  const rows = data.map(etf => {
    const isFav = state.watchlist.has(etf.name);
    return `
    <tr class="${isFav ? 'is-fav' : ''}">
      <td class="col-fav ${isFav ? 'active' : ''}" onclick="toggleWatchlist('${etf.name}')">${isFav ? '★' : '☆'}</td>
      <td><div class="etf-name">${etf.name} <span class="market-tag tag-${isDom?'kr':'us'}">${isDom?'KR':'US'}</span></div></td>
      <td><div class="aum-text">${etf.aum.toLocaleString()}${unit}</div><div class="dividend-row"><span class="div-amount">${etf.dividend > 0 ? (isDom?'₩':'$')+etf.dividend.toLocaleString() : '-'}</span> <span class="div-cycle">(${etf.divCycle})</span></div></td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth >= 0 ? '+' : ''}${etf.growth}%</td>
      <td class="${etf['1m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1m'] >= 0 ? '+' : ''}${etf['1m']}%</td>
      <td class="${etf['3m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['3m'] >= 0 ? '+' : ''}${etf['3m']}%</td>
      <td class="${etf['6m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['6m'] >= 0 ? '+' : ''}${etf['6m']}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y'] >= 0 ? '+' : ''}${etf['1y']}%</td>
    </tr>`;
  }).join('');
  
  etfList.innerHTML = rows;
}

function renderCategories() {
  const categoryPills = document.getElementById('category-pills');
  if (!categoryPills) return;
  const tCats = TRANSLATIONS[state.lang].categories;
  let categories = state.market === 'us' ? NAVER_CATEGORIES.filter(c => c !== '코스닥') : NAVER_CATEGORIES;
  categoryPills.innerHTML = categories.map(cat => `<button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${tCats[cat] || cat}</button>`).join('');
}

window.toggleWatchlist = (name) => {
  if (state.watchlist.has(name)) state.watchlist.delete(name);
  else state.watchlist.add(name);
  localStorage.setItem('etf-watchlist', JSON.stringify([...state.watchlist]));
  updateDashboard();
};

function setupEventListeners() {
  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); state.lang = btn.dataset.lang; updateDashboard();
  }));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); state.market = btn.dataset.market; state.category = '전체'; updateDashboard();
  }));
  const categoryPills = document.getElementById('category-pills');
  if (categoryPills) categoryPills.addEventListener('click', (e) => { if (e.target.classList.contains('pill')) { state.category = e.target.dataset.category; updateDashboard(); } });
  
  const searchInput = document.getElementById('etf-search');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value;
        updateDashboard();
      }, 150);
    });
  }
  
  document.querySelectorAll('th.sortable').forEach(th => th.addEventListener('click', () => {
    state.sortOrder = (state.sortField === th.dataset.sort && state.sortOrder === 'desc') ? 'asc' : 'desc';
    state.sortField = th.dataset.sort; updateDashboard();
  }));
}
document.addEventListener('DOMContentLoaded', init);
