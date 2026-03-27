// [Naver Style Redesign] 국내 및 미국 ETF 정보 핸들링
let etfData = {};
let benchmarks = {};
let lastUpdateStr = '';
let indexFetchTime = '';

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
    'nav-academy': 'ETF 아카데미',
    'nav-about': '사이트 소개',
    'nav-contact': '제휴 문의',
    'header-title': '스마트한 ETF 투자의 시작',
    'header-subtitle': '공식 공시 데이터 기반의 투명한 ETF 성과 분석 플랫폼',
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
    'nav-academy': 'ETF Academy',
    'nav-about': 'About Us',
    'nav-contact': 'Contact',
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

// 캐시된 데이터 로드 또는 기본값
let GLOBAL_MARKETS = JSON.parse(localStorage.getItem('cached-indices')) || [
  { name: 'KOSPI', symbol: 'KOSPI', val: 0, change: 0 },
  { name: 'KOSDAQ', symbol: 'KOSDAQ', val: 0, change: 0 },
  { name: 'S&P 500', symbol: '^GSPC', val: 0, change: 0 },
  { name: 'NASDAQ', symbol: '^IXIC', val: 0, change: 0 },
  { name: 'Dow Jones', symbol: '^DJI', val: 0, change: 0 },
  { name: 'Nikkei 225', symbol: '^N225', val: 0, change: 0 },
  { name: 'FTSE 100', symbol: '^FTSE', val: 0, change: 0 },
  { name: 'DAX', symbol: '^GDAXI', val: 0, change: 0 }
];
indexFetchTime = localStorage.getItem('cached-index-time') || '';

const TRENDING_NEWS = [
  { cat: '증시', title: '중동 긴장 고조에 코스피 하락세 지속', url: 'https://news.naver.com', source: '한국경제', summary: '중동 리스크 확산으로 증시 변동성이 커지고 있습니다.' },
  { cat: '경제', title: '환율 변동성 확대... 시장 긴장감 고조', url: 'https://news.naver.com', source: '연합뉴스', summary: '달러 강세로 원/달러 환율이 높은 수준을 유지 중입니다.' },
  { cat: '산업', title: '반도체·자동차주 시장 주도권 쟁탈전', url: 'https://news.naver.com', source: '이데일리', summary: '핵심 산업군의 성과가 시장의 향방을 결정하고 있습니다.' },
  { cat: '속보', title: '정부, 시장 변동성 대응 모니터링 강화', url: 'https://news.naver.com', source: '서울경제', summary: '금융당국은 필요 시 시장 안정화 조치를 검토할 계획입니다.' },
  { cat: '분석', title: '방어적 성격의 배당 ETF로 자금 유입 지속', url: 'https://news.naver.com', source: '머니투데이', summary: '안정적인 인컴 수익을 찾는 투자자들이 늘고 있습니다.' }
];

async function init() {
  // 1. 즉시 렌더링 (체감 속도 최적화: 캐시된 지수와 뉴스 우선 로드)
  renderGlobalIndices();
  initTrendingNews();
  setupEventListeners();

  // 1.1 캐시된 ETF 데이터가 있다면 우선 표시
  const cachedEtfData = localStorage.getItem('cached-etf-data');
  if (cachedEtfData) {
    try {
      const dataRes = JSON.parse(cachedEtfData);
      etfData = dataRes.etfData;
      benchmarks = dataRes.benchmarks;
      lastUpdateStr = dataRes.lastUpdate;
      updateDashboard();
    } catch (e) {
      console.warn('Cached ETF data parse failed');
    }
  }

  // 2. 비동기 데이터 로딩 (병렬화 및 비차단형 전환)
  // 2.1 최신 ETF 데이터 로딩 (중요)
  fetch('data.json')
    .then(res => res.json())
    .then(dataRes => {
      etfData = dataRes.etfData;
      benchmarks = dataRes.benchmarks;
      lastUpdateStr = dataRes.lastUpdate;
      // 최신 데이터를 다시 캐시
      localStorage.setItem('cached-etf-data', JSON.stringify(dataRes));
      updateDashboard();
    })
    .catch(error => {
      console.error('ETF data fetch failed:', error);
    });

  // 2.2 실시간 지수 데이터 로딩 (별도 비동기 처리, 메인 화면 렌더링을 방해하지 않음)
  fetchGlobalIndices().catch(err => console.warn('Global indices fetch failed:', err));

  // 3. 주기적 업데이트 설정
  if (window.indexInterval) clearInterval(window.indexInterval);
  window.indexInterval = setInterval(fetchGlobalIndices, 300000);
}

async function fetchGlobalIndices() {
  try {
    const naverUrl = `https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(naverUrl)}`;
    
    const naverRes = await fetch(proxyUrl);
    const naverData = await naverRes.json();
    
    let updated = false;

    if (naverData && naverData.contents) {
      const naverContents = JSON.parse(naverData.contents);
      if (naverContents && naverContents.result && naverContents.result.areas) {
        const datas = naverContents.result.areas[0].datas;
        const kospiData = datas.find(d => d.cd === 'KOSPI');
        const kosdaqData = datas.find(d => d.cd === 'KOSDAQ');
        
        if (kospiData) {
          const item = GLOBAL_MARKETS.find(m => m.name === 'KOSPI');
          if (item) {
            item.val = parseFloat(kospiData.nv.replace(/,/g, ''));
            item.change = parseFloat(kospiData.cr);
            updated = true;
          }
        }
        if (kosdaqData) {
          const item = GLOBAL_MARKETS.find(m => m.name === 'KOSDAQ');
          if (item) {
            item.val = parseFloat(kosdaqData.nv.replace(/,/g, ''));
            item.change = parseFloat(kosdaqData.cr);
            updated = true;
          }
        }
      }
    }

    const otherMarkets = GLOBAL_MARKETS.filter(m => !['KOSPI', 'KOSDAQ'].includes(m.name));
    const otherSymbols = otherMarkets.map(m => m.symbol).join(',');
    const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${otherSymbols}`;
    const yahooProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yahooUrl)}`;
    
    const yahooRes = await fetch(yahooProxyUrl);
    const yahooData = await yahooRes.json();
    if (yahooData && yahooData.contents) {
      const yahooContents = JSON.parse(yahooData.contents);
      if (yahooContents && yahooContents.quoteResponse && yahooContents.quoteResponse.result) {
        const quotes = yahooContents.quoteResponse.result;
        GLOBAL_MARKETS.forEach(market => {
          if (['KOSPI', 'KOSDAQ'].includes(market.name)) return;
          const quote = quotes.find(q => q.symbol === market.symbol);
          if (quote) {
            market.val = quote.regularMarketPrice !== undefined ? quote.regularMarketPrice : market.val;
            market.change = quote.regularMarketChangePercent !== undefined ? parseFloat(quote.regularMarketChangePercent.toFixed(2)) : market.change;
            updated = true;
          }
        });
      }
    }

    if (updated) {
      const now = new Date();
      indexFetchTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      // 로컬 스토리지에 캐시 저장
      localStorage.setItem('cached-indices', JSON.stringify(GLOBAL_MARKETS));
      localStorage.setItem('cached-index-time', indexFetchTime);
      renderGlobalIndices();
    }
  } catch (error) {
    console.warn('Live data fetch failed:', error);
  }
}

function renderGlobalIndices() {
  const ticker = document.getElementById('index-ticker');
  if (!ticker) return;
  
  const items = [...GLOBAL_MARKETS, ...GLOBAL_MARKETS];
  const isKo = state.lang === 'ko';
  const sourceText = isKo ? '출처: 네이버/야후 (15분 지연)' : 'Source: Naver/Yahoo (15m delay)';
  const updateText = indexFetchTime ? `[${indexFetchTime} ${isKo ? '갱신' : 'Refreshed'}]` : '';

  ticker.innerHTML = `
    <div class="ticker-source-tag">${sourceText} ${updateText}</div>
    ${items.map(idx => {
      if (idx.val === 0) return `<div class="index-item"><span class="index-name">${idx.name}</span><span class="index-val">...</span></div>`;
      const isPos = idx.change >= 0;
      return `
        <div class="index-item">
          <span class="index-name">${idx.name}</span>
          <span class="index-val">${idx.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span class="index-change" style="color: ${isPos ? 'var(--positive)' : 'var(--negative)'}">
            ${isPos ? '▲' : '▼'} ${Math.abs(idx.change).toFixed(2)}%
          </span>
        </div>
      `;
    }).join('')}
  `;
}

function initTrendingNews() {
  const newsContainer = document.getElementById('trending-news');
  if (!newsContainer) return;
  const tCats = TRANSLATIONS[state.lang]['news-cats'];
  let currentIdx = 0;

  const renderNews = () => {
    newsContainer.innerHTML = '';
    TRENDING_NEWS.forEach((news, i) => {
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
      if (offset < 0) offset += TRENDING_NEWS.length;
      item.style.transform = `translateY(${offset * 100}%)`;
      if (offset === 0) item.classList.add('active');
    });
    currentIdx = (currentIdx + 1) % TRENDING_NEWS.length;
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
  etfList.innerHTML = data.map(etf => `
    <tr class="${state.watchlist.has(etf.name) ? 'is-fav' : ''}">
      <td class="col-fav ${state.watchlist.has(etf.name) ? 'active' : ''}" onclick="toggleWatchlist('${etf.name}')">${state.watchlist.has(etf.name) ? '★' : '☆'}</td>
      <td><div class="etf-name">${etf.name} <span class="market-tag tag-${isDom?'kr':'us'}">${isDom?'KR':'US'}</span></div></td>
      <td><div class="aum-text">${etf.aum.toLocaleString()}${unit}</div><div class="dividend-row"><span class="div-amount">${etf.dividend > 0 ? (isDom?'₩':'$')+etf.dividend.toLocaleString() : '-'}</span> <span class="div-cycle">(${etf.divCycle})</span></div></td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth >= 0 ? '+' : ''}${etf.growth}%</td>
      <td class="${etf['1m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1m'] >= 0 ? '+' : ''}${etf['1m']}%</td>
      <td class="${etf['3m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['3m'] >= 0 ? '+' : ''}${etf['3m']}%</td>
      <td class="${etf['6m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['6m'] >= 0 ? '+' : ''}${etf['6m']}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y'] >= 0 ? '+' : ''}${etf['1y']}%</td>
    </tr>`).join('');
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
  if (searchInput) searchInput.addEventListener('input', (e) => { state.searchQuery = e.target.value; updateDashboard(); });
  document.querySelectorAll('th.sortable').forEach(th => th.addEventListener('click', () => {
    state.sortOrder = (state.sortField === th.dataset.sort && state.sortOrder === 'desc') ? 'asc' : 'desc';
    state.sortField = th.dataset.sort; updateDashboard();
  }));
}
document.addEventListener('DOMContentLoaded', init);
