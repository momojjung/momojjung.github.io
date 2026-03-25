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

// 네이버 ETF 스타일 카테고리 (11개)
const NAVER_CATEGORIES = [
  '전체', '배당', '코스닥', '방산', 'S&P500', '나스닥100', '금', '월배당', '원유', '2차전지', '로봇'
];

// 금일 장마감 기준(2026-03-19) 데이터로 업데이트
let GLOBAL_MARKETS = [
  { name: 'KOSPI', symbol: 'KOSPI', val: 5763.22, change: -2.73 },
  { name: 'KOSDAQ', symbol: 'KOSDAQ', val: 1143.48, change: -1.79 },
  { name: 'S&P 500', symbol: '^GSPC', val: 5120.34, change: 0.85 },
  { name: 'NASDAQ', symbol: '^IXIC', val: 16245.12, change: 1.15 },
  { name: 'Dow Jones', symbol: '^DJI', val: 39120.45, change: 0.65 },
  { name: 'Nikkei 225', symbol: '^N225', val: 38520.12, change: 1.45 },
  { name: 'FTSE 100', symbol: '^FTSE', val: 7820.45, change: 0.32 },
  { name: 'DAX', symbol: '^GDAXI', val: 17850.32, change: 0.54 }
];

const TRENDING_NEWS = [
  { 
    cat: '증시', 
    title: '중동 긴장 고조에 코스피 5,763선으로 급락 마감', 
    url: 'https://news.naver.com', 
    source: '한국경제',
    summary: '중동 지역의 지정학적 리스크 확산과 국제 유가 급등 영향으로 국내 증시가 큰 폭의 하락세를 보였습니다. 인플레이션 우려가 다시 고개를 들고 있습니다.'
  },
  { 
    cat: '경제', 
    title: '환율 1,500원 돌파... 17년 만에 최고치 기록', 
    url: 'https://news.naver.com', 
    source: '연합뉴스',
    summary: '달러 강세와 안전자산 선호 현상이 겹치면서 원/달러 환율이 1,500원을 넘어섰습니다. 이는 금융위기 이후 가장 높은 수준입니다.'
  },
  { 
    cat: '산업', 
    title: '반도체·자동차주 일제히 하락... 2차전지는 선방', 
    url: 'https://news.naver.com', 
    source: '이데일리',
    summary: '코스피 대형주들이 시장 급락의 직격탄을 맞은 가운데, 일부 테마주와 2차전지 관련주들은 상대적으로 낮은 하락폭을 기록하며 버텼습니다.'
  },
  { 
    cat: '속보', 
    title: '정부, 시장 변동성 확대에 긴급 시장상황 점검회의', 
    url: 'https://news.naver.com', 
    source: '서울경제',
    summary: '금융당국은 최근 증시 급락과 환율 급등에 대응하기 위해 긴급 회의를 소집하고 시장 안정화 대책을 논의하기로 했습니다.'
  },
  { 
    cat: '분석', 
    title: '변동성 장세 속 배당 ETF로 자금 유입 가속화', 
    url: 'https://news.naver.com', 
    source: '머니투데이',
    summary: '시장의 불확실성이 커지면서 안정적인 배당 수익을 기대할 수 있는 고배당 및 월배당 ETF로의 자금 쏠림 현상이 나타나고 있습니다.'
  }
];

async function init() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('data.json loading failed');
    const data = await response.json();
    etfData = data.etfData;
    benchmarks = data.benchmarks;
    lastUpdateStr = data.lastUpdate;
    
    // 초기 로드 시 실시간 데이터처럼 약간의 변동성 부여
    fluctuateAllData();
    
    await initGlobalIndices();
    initTrendingNews();
    
    updateDashboard();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load ETF data:', error);
  }
}

async function initGlobalIndices() {
  await fetchGlobalIndices();
  // 1분마다 갱신
  if (window.indexInterval) clearInterval(window.indexInterval);
  window.indexInterval = setInterval(fetchGlobalIndices, 60000);
}

async function fetchGlobalIndices() {
  try {
    // 1. 네이버 증권 실시간 API 호출 (프록시 사용)
    const naverUrl = `https://polling.finance.naver.com/api/realtime?query=SERVICE_INDEX:KOSPI,KOSDAQ`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(naverUrl)}`;
    
    const naverRes = await fetch(proxyUrl);
    const naverData = await naverRes.json();
    
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
          }
        }
        if (kosdaqData) {
          const item = GLOBAL_MARKETS.find(m => m.name === 'KOSDAQ');
          if (item) {
            item.val = parseFloat(kosdaqData.nv.replace(/,/g, ''));
            item.change = parseFloat(kosdaqData.cr);
          }
        }
      }
    }

    // 2. 해외 지수 데이터 (Yahoo Finance 기반)
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
          }
        });
      }
    }
  } catch (error) {
    console.warn('실시간 데이터 연동 실패, 기본 데이터 유지:', error);
  }
  renderGlobalIndices();
}

function renderGlobalIndices() {
  const ticker = document.getElementById('index-ticker');
  if (!ticker) return;
  
  const items = [...GLOBAL_MARKETS, ...GLOBAL_MARKETS];
  const sourceText = state.lang === 'ko' ? '출처: 네이버 증권' : 'Source: Naver Finance';

  ticker.innerHTML = `
    <div class="ticker-source-tag">${sourceText}</div>
    ${items.map(idx => {
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
  const tCats = TRANSLATIONS[state.lang]['news-cats'];
  let currentIdx = 0;

  const renderNews = () => {
    newsContainer.innerHTML = '';
    TRENDING_NEWS.forEach((news, i) => {
      const item = document.createElement('div');
      item.className = `news-item ${i === 0 ? 'active' : ''}`;
      item.style.transform = `translateY(${i * 100}%)`;
      item.innerHTML = `
        <span class="news-category">[${tCats[news.cat] || news.cat}]</span>
        <span class="news-title">${news.title}</span>
        <span class="news-source">${news.source}</span>
      `;
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

const openNewsModal = (news) => {
  const modal = document.getElementById('news-modal');
  const tCats = TRANSLATIONS[state.lang]['news-cats'];
  document.getElementById('modal-news-cat').textContent = tCats[news.cat] || news.cat;
  document.getElementById('modal-news-title').textContent = news.title;
  document.getElementById('modal-news-summary').textContent = news.summary;
  document.getElementById('modal-news-source').textContent = news.source;
  const urlText = document.getElementById('modal-news-url-text');
  if (urlText) urlText.textContent = news.url;
  const urlBtn = document.getElementById('modal-news-url');
  if (urlBtn) urlBtn.href = news.url;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

const closeNewsModal = () => {
  const modal = document.getElementById('news-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

function fluctuate(val, range = 0.5) {
  const change = (Math.random() * 2 - 1) * range;
  return parseFloat((val + change).toFixed(2));
}

function fluctuateAllData() {
  const markets = ['domestic', 'us'];
  markets.forEach(m => {
    if (!etfData[m]) return;
    etfData[m] = etfData[m].map(item => ({
      ...item,
      growth: fluctuate(item.growth, 0.2),
      '1m': fluctuate(item['1m'], 0.1),
      '3m': fluctuate(item['3m'], 0.1),
      '6m': fluctuate(item['6m'], 0.1),
      '1y': fluctuate(item['1y'], 0.1),
      aum: Math.floor(item.aum * (1 + (Math.random() * 0.002 - 0.001)))
    }));
  });
}

function updateDashboard() {
  if (!etfData || !etfData.domestic) return;
  fluctuateAllData();
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
        document.getElementById('etf-search').placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
}

function fluctuateGlobalIndices() {
  GLOBAL_MARKETS.forEach(idx => {
    idx.val = fluctuate(idx.val, idx.val * 0.001);
    idx.change = fluctuate(idx.change, 0.05);
  });
  renderGlobalIndices();
}

function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const prefix = state.lang === 'ko' ? '실시간 업데이트' : 'Live Update';
    lastUpdateEl.textContent = `${prefix}: ${timeStr}`;
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
    if (state.sortOrder === 'asc') return valA > valB ? 1 : -1;
    else return valA < valB ? 1 : -1;
  });
  return data;
}

function renderSummary(data) {
  if (!data || data.length === 0) {
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
  const unit = TRANSLATIONS[state.lang][state.market === 'domestic' ? 'unit-aum-kr' : 'unit-aum-us'];
  document.getElementById('top-div-val').textContent = `${topAum.aum.toLocaleString()}${unit}`;
  document.getElementById('top-div-name').textContent = topAum.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  if (!etfList) return;
  const isDom = state.market === 'domestic';
  const divSign = isDom ? '₩' : '$';
  const unit = TRANSLATIONS[state.lang][isDom ? 'unit-aum-kr' : 'unit-aum-us'];
  if (!data || data.length === 0) {
    etfList.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 2rem;">검색 결과가 없습니다.</td></tr>';
    return;
  }
  etfList.innerHTML = data.map(etf => {
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
        <div class="aum-text">${etf.aum.toLocaleString()}${unit}</div>
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

function renderCategories() {
  const categoryPills = document.getElementById('category-pills');
  if (!categoryPills) return;
  const tCats = TRANSLATIONS[state.lang].categories;
  let categories = NAVER_CATEGORIES;
  if (state.market === 'us') {
    categories = NAVER_CATEGORIES.filter(c => c !== '코스닥');
    if (state.category === '코스닥') { state.category = '전체'; }
  }
  categoryPills.innerHTML = categories.map(cat => `
    <button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${tCats[cat] || cat}</button>
  `).join('');
}
window.toggleWatchlist = (name) => {
  if (state.watchlist.has(name)) state.watchlist.delete(name);
  else state.watchlist.add(name);
  localStorage.setItem('etf-watchlist', JSON.stringify([...state.watchlist]));
  updateDashboard();
};

function setupEventListeners() {
  const modal = document.getElementById('news-modal');
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeNewsModal);
  if (modal) { modal.addEventListener('click', (e) => { if (e.target === modal) closeNewsModal(); }); }
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lang = btn.dataset.lang;
      initTrendingNews();
      updateDashboard();
    });
  });
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      state.category = '전체';
      updateDashboard();
    });
  });
  const categoryPills = document.getElementById('category-pills');
  if (categoryPills) { categoryPills.addEventListener('click', (e) => { if (e.target.classList.contains('pill')) { state.category = e.target.dataset.category; updateDashboard(); } }); }
  const searchInput = document.getElementById('etf-search');
  if (searchInput) { searchInput.addEventListener('input', (e) => { state.searchQuery = e.target.value; updateDashboard(); }); }
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
