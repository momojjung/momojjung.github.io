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
  { 
    cat: '증시', 
    title: '금리 인하 기대감에 미 증시 일제히 상승 마감', 
    url: 'https://finance.naver.com/news/news_read.naver?article_id=0005213600&office_id=015', 
    source: '한국경제',
    summary: '미국 소비자물가지수(CPI) 둔화 소식에 연준의 조기 금리 인하 기대감이 커지며 뉴욕 증시가 일제히 강세를 보였습니다.'
  },
  { 
    cat: '경제', 
    title: '국내 수출 5개월 연속 플러스 행진... 반도체 견인', 
    url: 'https://finance.naver.com/news/news_read.naver?article_id=0014568212&office_id=001', 
    source: '연합뉴스',
    summary: '올해 들어 반도체 수출이 가파른 회복세를 보이면서 전체 수출 실적을 견인하고 있습니다. 5개월 연속 성장세입니다.'
  },
  { 
    cat: '산업', 
    title: '2차전지 관련주, 실적 발표 앞두고 변동성 확대', 
    url: 'https://finance.naver.com/news/news_read.naver?article_id=0005698241&office_id=018', 
    source: '이데일리',
    summary: '삼성SDI, 에코프로비엠 등 주요 2차전지 종목들의 실적 발표를 앞두고 투자자들의 관망세가 짙어지며 주가 변동성이 커지고 있습니다.'
  },
  { 
    cat: '속보', 
    title: '일본 니케이 지수 역대 최고치 경신... 엔저 효과', 
    url: 'https://finance.naver.com/news/news_read.naver?article_id=0004932145&office_id=011', 
    source: '서울경제',
    summary: '일본 증시가 버블 경제 붕괴 이후 약 34년 만에 최고치를 경신했습니다. 기업 실적 개선과 엔저 현상이 주요 원인입니다.'
  },
  { 
    cat: '분석', 
    title: '올해 ETF 투자 키워드는 "월배당"과 "AI 로봇"', 
    url: 'https://finance.naver.com/news/news_read.naver?article_id=0002124567&office_id=008', 
    source: '머니투데이',
    summary: '안정적인 현금 흐름을 선호하는 투자자들이 늘어나면서 매월 배당을 지급하는 ETF와 성장성이 높은 AI·로봇 테마 ETF가 인기입니다.'
  }
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
  const modal = document.getElementById('news-modal');
  const closeBtn = document.getElementById('close-modal');
  const tCats = TRANSLATIONS[state.lang]['news-cats'];
  let currentIdx = 0;

  const openModal = (news) => {
    document.getElementById('modal-news-cat').textContent = tCats[news.cat] || news.cat;
    document.getElementById('modal-news-title').textContent = news.title;
    document.getElementById('modal-news-summary').textContent = news.summary;
    document.getElementById('modal-news-source').textContent = news.source;
    const urlBtn = document.getElementById('modal-news-url');
    urlBtn.href = news.url;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const renderNews = () => {
    newsContainer.innerHTML = TRENDING_NEWS.map((news, i) => `
      <div class="news-item ${i === 0 ? 'active' : ''}" style="transform: translateY(${i * 100}%)" data-index="${i}">
        <span class="news-category">[${tCats[news.cat] || news.cat}]</span>
        <span class="news-title">${news.title}</span>
        <span class="news-source">${news.source}</span>
      </div>
    `).join('');

    // 클릭 이벤트 리스너 추가
    newsContainer.querySelectorAll('.news-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = item.getAttribute('data-index');
        openModal(TRENDING_NEWS[idx]);
      });
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

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  renderNews();
  if (window.newsInterval) clearInterval(window.newsInterval);
  window.newsInterval = setInterval(rotateNews, 4000);
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
  initGlobalIndices();
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
  
  const unit = TRANSLATIONS[state.lang][state.market === 'domestic' ? 'unit-aum-kr' : 'unit-aum-us'];
  document.getElementById('top-div-val').textContent = `${topAum.aum.toLocaleString()}${unit}`;
  document.getElementById('top-div-name').textContent = topAum.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  const isDom = state.market === 'domestic';
  const divSign = isDom ? '₩' : '$';
  const unit = TRANSLATIONS[state.lang][isDom ? 'unit-aum-kr' : 'unit-aum-us'];

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
  const tCats = TRANSLATIONS[state.lang].categories;
  
  categoryPills.innerHTML = NAVER_CATEGORIES.map(cat => `
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
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lang = btn.dataset.lang;
      initTrendingNews(); // Update news tags
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
