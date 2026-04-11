// [Financial Magazine Edition] Real-time Analysis & Content-rich Platform
let etfData = {};
let state = {
  market: 'domestic',
  searchQuery: '',
  lang: 'ko'
};

const TRANSLATIONS = {
  ko: {
    'nav-report': '시장 리포트', 'nav-data': '데이터 룸', 'nav-guide': '투자 가이드', 'nav-kb': '용어 사전',
    'hero-tag': 'Cover Story',
    'hero-title': '2026년 글로벌 ETF 시장의 대전환: AI를 넘어 \'인프라\'로',
    'hero-desc': '인공지능(AI) 반도체 열풍이 지나간 자리에 새로운 인프라 투자 시대가 열리고 있습니다. 전 세계적인 에너지 전환과 스마트 시티 건설 수요가 폭증함에 따라 관련 ETF들의 수익률이 심상치 않습니다.',
    'hero-btn': '실시간 데이터 확인하기 →',
    'chart-title': '시장 섹터별 수익률 추이',
    'edit-choice-title': 'Editor\'s Choice: 2026 Q2 Market Strategy',
    'edit-choice-desc': '금융 데이터 분석가가 제안하는 섹터별 심층 분석 리포트',
    'article-t1': '월배당 ETF 열풍의 이면: SCHD vs JEPI 실질 수익률 비교',
    'article-p1': 'SCHD는 10년 연속 배당금을 증액한 기업에 투자하는 \'배당 성장\' 전략을 취하며 하락장에서의 방어력이 뛰어납니다. 반면, JEPI는 커버드콜 전략을 통해 높은 분배율을 유지합니다.',
    'article-t2': 'AI 반도체를 넘어 \'전력망\'과 \'에너지\' 인프라로',
    'article-p2': '데이터 센터 가동에 필요한 막대한 전력 소모가 전 세계적인 전력 부족 사태를 야기함에 따라 구리 공급망 및 송전망 구축 관련 ETF들이 신고가를 경신하고 있습니다.',
    'article-t3': '금융투자소득세 시대의 생존법: ISA 계좌 최적화',
    'article-p3': '2026년 개편된 금융투자소득세 환경에서 투자 수익을 극대화하는 핵심은 \'비과세\'와 \'분리과세\' 활용에 있습니다. ISA 계좌의 절세 효과를 분석했습니다.',
    'data-room-title': 'ETF Data Room',
    'data-room-desc': '공식 공시 데이터를 바탕으로 한 실시간 성과 지표',
    'th-rank': '순위', 'th-name': '종목명', 'th-aum': '시가총액', 'th-growth': '수익률(YTD)', 'th-1y': '1년 수익률', 'th-div': '배당금', 'th-risk': '위험도',
    'kb-title': 'ETF Knowledge Base', 'kb-desc': '투자 전 반드시 알아야 할 핵심 용어 해설',
    'dt-ter': 'TER (총보수비용)', 'dd-ter': '운용보수뿐만 아니라 모든 비용을 합산한 비율입니다.',
    'dt-nav': 'NAV (순자산가치)', 'dd-nav': 'ETF가 보유한 자산의 주당 실제 가치입니다.',
    'dt-te': 'Tracking Error (추적오차)', 'dd-te': '기초지수 수익률과 실제 ETF 수익률 사이의 차이입니다.',
    'dt-inav': 'iNAV (실시간 가치)', 'dd-inav': '장중 실시간으로 계산되는 ETF의 주당 가치입니다.',
    'footer-about-text': '기관급 데이터 분석을 통해 개인 투자자의 성공적인 자산 관리를 돕는 프리미엄 금융 미디어입니다.',
    'footer-disclaimer-text': '본 사이트에서 제공하는 모든 정보는 교육 및 정보 제공만을 목적으로 하며, 투자 결과에 대한 모든 책임은 투자자 본인에게 있습니다.'
  },
  en: {
    'nav-report': 'Market Report', 'nav-data': 'Data Room', 'nav-guide': 'Guide', 'nav-kb': 'Glossary',
    'hero-tag': 'Cover Story',
    'hero-title': '2026 Global ETF Pivot: Beyond AI to \'Infrastructure\'',
    'hero-desc': 'As the AI semiconductor rally matures, a new era of infrastructure investment is emerging. Surging demand for energy transition and smart cities is driving unprecedented yields in related ETFs.',
    'hero-btn': 'Check Live Data →',
    'chart-title': 'Yield Trends by Sector',
    'edit-choice-title': 'Editor\'s Choice: 2026 Q2 Market Strategy',
    'edit-choice-desc': 'In-depth sector analysis reports proposed by financial data analysts.',
    'article-t1': 'The Moon of Monthly Dividends: SCHD vs JEPI Real Yields',
    'article-p1': 'SCHD employs a dividend growth strategy, investing in firms with 10+ years of increases, showing resilience in downturns. JEPI maintains high yields via covered calls.',
    'article-t2': 'Beyond AI: Power Grids and Energy Infrastructure',
    'article-p2': 'Massive electricity needs for data centers are causing power shortages, leading copper supply chain and grid construction ETFs to hit new record highs.',
    'article-t3': 'Investing in the New Tax Era: ISA Account Optimization',
    'article-p3': 'In the 2026 revised financial tax environment, the key to maximizing returns lies in utilizing tax-exempt and separate taxation via ISA accounts.',
    'data-room-title': 'ETF Data Room',
    'data-room-desc': 'Real-time performance metrics based on official disclosures.',
    'th-rank': 'Rank', 'th-name': 'Name', 'th-aum': 'AUM', 'th-growth': 'Growth(YTD)', 'th-1y': '1 Year', 'th-div': 'Dividend', 'th-risk': 'Risk',
    'kb-title': 'ETF Knowledge Base', 'kb-desc': 'Essential terminology guide before investing.',
    'dt-ter': 'TER (Total Expense Ratio)', 'dd-ter': 'The sum of all costs incurred in the ETF management process.',
    'dt-nav': 'NAV (Net Asset Value)', 'dd-nav': 'The actual value of the assets held by the ETF per share.',
    'dt-te': 'Tracking Error', 'dd-te': 'The difference between the index return and the actual ETF return.',
    'dt-inav': 'iNAV (Intraday NAV)', 'dd-inav': 'Real-time calculated value per share during trading hours.',
    'footer-about-text': 'A premium financial media helping individual investors manage assets via institutional-grade data analysis.',
    'footer-disclaimer-text': 'All information is for educational purposes only. Investors are solely responsible for their investment decisions.'
  }
};

async function init() {
  initHeroChart();
  initTicker();
  setupEventListeners();

  const cachedEtfData = localStorage.getItem('cached-etf-data');
  if (cachedEtfData) {
    try {
      const dataRes = JSON.parse(cachedEtfData);
      etfData = dataRes.etfData;
      updateDashboard();
    } catch (e) { console.warn('Cached data failed'); }
  }

  fetch('data.json?t=' + Date.now())
    .then(res => res.json())
    .then(dataRes => {
      etfData = dataRes.etfData;
      localStorage.setItem('cached-etf-data', JSON.stringify(dataRes));
      updateDashboard();
    })
    .catch(error => console.error('Data fetch failed:', error));
}

function initTicker() {
  const tickerContainer = document.getElementById('ticker-content');
  if (!tickerContainer) return;

  const indices = [
    { name: 'S&P 500', val: 5421.22 },
    { name: 'NASDAQ', val: 18321.50 },
    { name: 'KOSPI', val: 2752.10 },
    { name: 'USD/KRW', val: 1345.50 },
    { name: 'GOLD', val: 2350.10 }
  ];

  const updateTicker = () => {
    tickerContainer.innerHTML = indices.map(idx => {
      const change = (Math.random() * 0.4 - 0.15).toFixed(2); // Simulate live fluctuation
      const isUp = change >= 0;
      return `<span class="ticker-item">${idx.name} <span class="${isUp?'up':'down'}">${(idx.val * (1 + change/100)).toFixed(2)} (${isUp?'+':''}${change}%)</span></span>`;
    }).join('') + tickerContainer.innerHTML; // Duplicate for seamless loop if needed
  };

  updateTicker();
  setInterval(updateTicker, 10000); // Update every 10s for vitality
}

function initHeroChart() {
  const ctx = document.getElementById('heroChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Semicon', 'Dividend', 'Battery', 'Infra', 'Gold'],
      datasets: [{
        label: 'Expected Yield (%)',
        data: [12.5, 8.2, -4.5, 15.8, 10.1],
        backgroundColor: ['#1a2a40', '#c5a059', '#d63031', '#1a2a40', '#c5a059'],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function updateDashboard() {
  applyTranslations();
  if (!etfData || !etfData.domestic) return;
  renderTable(getFilteredData());
}

function applyTranslations() {
  const t = TRANSLATIONS[state.lang];
  Object.keys(t).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = t[id];
  });

  // Handle elements by class for articles
  const classes = ['article-t1', 'article-p1', 'article-t2', 'article-p2', 'article-t3', 'article-p3', 'report-tag'];
  classes.forEach(cls => {
    document.querySelectorAll('.' + cls).forEach(el => {
      // Logic for report tags
      if (cls === 'report-tag') {
        if (el.classList.contains('tag-div')) el.innerText = state.lang === 'ko' ? '배당 전략' : 'Dividend';
        if (el.classList.contains('tag-tech')) el.innerText = state.lang === 'ko' ? '기술 섹터' : 'Tech Sector';
        if (el.classList.contains('tag-tax')) el.innerText = state.lang === 'ko' ? '절세 전략' : 'Tax Strategy';
      } else {
        if (t[cls]) el.innerText = t[cls];
      }
    });
  });
}

function getFilteredData() {
  let data = [...etfData[state.market]];
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }
  data.sort((a, b) => b.aum - a.aum);
  return data;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  if (!etfList) return;

  const rows = data.slice(0, 15).map((etf, index) => {
    const isDom = state.market === 'domestic';
    const unit = isDom ? (state.lang === 'ko' ? '억' : 'B') : 'M';
    const divPrefix = isDom ? '₩' : '$';
    
    return `
    <tr>
      <td class="rank-cell">#${index + 1}</td>
      <td class="etf-name-cell">${etf.name}</td>
      <td>${etf.aum.toLocaleString()}${unit}</td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth >= 0 ? '+' : ''}${etf.growth}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y'] >= 0 ? '+' : ''}${etf['1y']}%</td>
      <td>${etf.dividend > 0 ? divPrefix + etf.dividend.toLocaleString() : '-'}</td>
      <td><span class="risk-badge risk-${etf.risk}">${getRiskText(etf.risk)}</span></td>
    </tr>`;
  }).join('');
  etfList.innerHTML = rows;
}

function getRiskText(risk) {
  const map_ko = { 1: '매우낮음', 2: '낮음', 3: '보통', 4: '높음', 5: '매우높음' };
  const map_en = { 1: 'Very Low', 2: 'Low', 3: 'Medium', 4: 'High', 5: 'Very High' };
  return state.lang === 'ko' ? map_ko[risk] : map_en[risk];
}

function setupEventListeners() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lang = btn.dataset.lang;
      document.documentElement.lang = state.lang;
      updateDashboard();
    });
  });

  document.querySelectorAll('.market-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.market-switcher button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      updateDashboard();
    });
  });

  const searchInput = document.getElementById('etf-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      updateDashboard();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
