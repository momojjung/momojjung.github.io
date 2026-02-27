// Comprehensive ETF Data Structure
const etfData = {
  domestic: [
    // 지수/인기/거래/규모 등 복합 데이터
    { name: 'KODEX 200', category: '지수', assetClass: '주식형', growth: 12.5, '1m': 2.1, '3m': 5.4, '6m': 8.2, '1y': 15.1, volume: 4500, aum: 650000, dividend: 2.1, divCycle: '분기', popularity: 98 },
    { name: 'TIGER 200', category: '지수', assetClass: '주식형', growth: 12.4, '1m': 2.0, '3m': 5.3, '6m': 8.1, '1y': 15.0, volume: 3800, aum: 420000, dividend: 2.2, divCycle: '분기', popularity: 94 },
    { name: 'KODEX 레버리지', category: '지수', assetClass: '주식형', growth: 25.4, '1m': 4.2, '3m': 10.5, '6m': 16.2, '1y': 32.1, volume: 12000, aum: 210000, dividend: 0, divCycle: '-', popularity: 99 },
    { name: 'KODEX 200선물인버스2X', category: '지수', assetClass: '주식형', growth: -22.1, '1m': -4.1, '3m': -10.2, '6m': -15.8, '1y': -30.5, volume: 15000, aum: 180000, dividend: 0, divCycle: '-', popularity: 97 },
    { name: 'KODEX 코스닥150', category: '지수', assetClass: '주식형', growth: -5.2, '1m': -1.5, '3m': -3.2, '6m': -8.4, '1y': -12.1, volume: 2500, aum: 95000, dividend: 0.1, divCycle: '연', popularity: 88 },
    { name: 'TIGER 미국나스닥100', category: '해외지수', assetClass: '주식형', growth: 25.8, '1m': 4.5, '3m': 10.2, '6m': 18.5, '1y': 32.4, volume: 3200, aum: 320000, dividend: 0.5, divCycle: '분기', popularity: 95 },
    { name: 'KODEX 미국S&P500TR', category: '해외지수', assetClass: '주식형', growth: 20.5, '1m': 3.8, '3m': 8.5, '6m': 14.2, '1y': 24.8, volume: 2800, aum: 250000, dividend: 0, divCycle: 'N/A', popularity: 93 },
    { name: 'KODEX 반도체', category: '섹터', assetClass: '주식형', growth: 35.2, '1m': 8.1, '3m': 15.4, '6m': 22.1, '1y': 45.2, volume: 2800, aum: 150000, dividend: 1.2, divCycle: '연', popularity: 92 },
    { name: 'TIGER AI반도체핵심공정', category: '테마', assetClass: '주식형', growth: 42.5, '1m': 9.5, '3m': 21.4, '6m': 35.2, '1y': 58.7, volume: 2100, aum: 52000, dividend: 0.1, divCycle: '연', popularity: 96 },
    { name: 'TIGER 2차전지테마', category: '테마', assetClass: '주식형', growth: -15.4, '1m': -5.2, '3m': -8.1, '6m': -12.4, '1y': -20.5, volume: 5100, aum: 280000, dividend: 0.2, divCycle: '연', popularity: 89 },
    { name: 'KODEX 자동차', category: '섹터', assetClass: '주식형', growth: 18.5, '1m': 3.4, '3m': 7.8, '6m': 12.5, '1y': 25.4, volume: 900, aum: 85000, dividend: 2.5, divCycle: '연', popularity: 75 },
    
    // 배당금 특화
    { name: 'TIGER 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.1, '1m': 1.5, '3m': 3.2, '6m': 5.8, '1y': 12.4, volume: 1500, aum: 210000, dividend: 3.8, divCycle: '월', popularity: 94 },
    { name: 'SOL 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.2, '1m': 1.6, '3m': 3.3, '6m': 5.9, '1y': 12.5, volume: 1100, aum: 95000, dividend: 3.9, divCycle: '월', popularity: 82 },
    { name: 'ACE 미국배당다우존스', category: '배당', assetClass: '주식형', growth: 10.0, '1m': 1.4, '3m': 3.1, '6m': 5.7, '1y': 12.3, volume: 800, aum: 65000, dividend: 3.7, divCycle: '월', popularity: 80 },
    { name: 'ARIRANG 고배당주', category: '배당', assetClass: '주식형', growth: 6.8, '1m': 1.1, '3m': 2.5, '6m': 4.1, '1y': 8.5, volume: 400, aum: 35000, dividend: 5.2, divCycle: '연', popularity: 55 },
    { name: 'KODEX 고배당', category: '배당', assetClass: '주식형', growth: 5.5, '1m': 0.8, '3m': 1.8, '6m': 3.2, '1y': 7.1, volume: 300, aum: 21000, dividend: 4.5, divCycle: '연', popularity: 45 },
    
    // 채권/기타
    { name: 'KODEX 단기채권', category: '채권', assetClass: '채권형', growth: 3.5, '1m': 0.3, '3m': 0.8, '6m': 1.7, '1y': 3.8, volume: 8500, aum: 450000, dividend: 3.2, divCycle: '월', popularity: 60 },
    { name: 'TIGER 국고채3년', category: '채권', assetClass: '채권형', growth: 2.1, '1m': 0.1, '3m': 0.5, '6m': 1.2, '1y': 2.5, volume: 1200, aum: 85000, dividend: 2.8, divCycle: '분기', popularity: 50 },
    { name: 'KODEX 종합채권액티브', category: '채권', assetClass: '채권형', growth: 2.8, '1m': 0.2, '3m': 0.6, '6m': 1.5, '1y': 3.1, volume: 1100, aum: 250000, dividend: 3.0, divCycle: '월', popularity: 58 },
    { name: 'TIGER 금은선물(H)', category: '원자재', assetClass: '원자재형', growth: 15.2, '1m': 2.5, '3m': 4.1, '6m': 7.8, '1y': 18.2, volume: 800, aum: 42000, dividend: 0, divCycle: '-', popularity: 78 },
    { name: 'KODEX WTI원유선물(H)', category: '원자재', assetClass: '원자재형', growth: -8.4, '1m': -2.1, '3m': -4.5, '6m': -12.1, '1y': -15.4, volume: 1500, aum: 32000, dividend: 0, divCycle: '-', popularity: 82 },
    { name: 'KODEX 미국달러선물', category: '통화', assetClass: '대체투자형', growth: 4.2, '1m': 0.8, '3m': 1.2, '6m': 2.5, '1y': 5.1, volume: 1200, aum: 35000, dividend: 0, divCycle: '-', popularity: 72 },
    { name: 'TIGER 부동산인프라고배당', category: '리츠', assetClass: '대체투자형', growth: 5.4, '1m': 1.1, '3m': 2.1, '6m': 3.5, '1y': 6.8, volume: 600, aum: 28000, dividend: 5.5, divCycle: '월', popularity: 85 },
    { name: 'KODEX TRF3070', category: '혼합', assetClass: '혼합자산형', growth: 8.5, '1m': 1.2, '3m': 3.4, '6m': 5.2, '1y': 10.2, volume: 300, aum: 15000, dividend: 1.5, divCycle: '연', popularity: 65 }
  ],
  us: [
    // 고배당 (High Dividend)
    { name: 'VYM (High Dividend Yield)', category: '고배당', assetClass: '주식형', growth: 12.5, '1m': 1.2, '3m': 4.5, '6m': 8.2, '1y': 15.8, dividend: 3.2, divCycle: '분기' },
    { name: 'SCHD (Dividend Equity)', category: '고배당', assetClass: '주식형', growth: 10.8, '1m': 1.5, '3m': 3.8, '6m': 7.1, '1y': 13.5, dividend: 3.4, divCycle: '분기' },
    { name: 'VIG (Dividend Appreciation)', category: '고배당', assetClass: '주식형', growth: 14.2, '1m': 2.1, '3m': 5.2, '6m': 9.5, '1y': 18.2, dividend: 1.8, divCycle: '분기' },
    { name: 'DGRO (Dividend Growth)', category: '고배당', assetClass: '주식형', growth: 13.5, '1m': 1.8, '3m': 4.9, '6m': 8.8, '1y': 17.1, dividend: 2.3, divCycle: '분기' },
    { name: 'HDV (High Dividend Value)', category: '고배당', assetClass: '주식형', growth: 9.2, '1m': 0.8, '3m': 3.1, '6m': 5.5, '1y': 11.2, dividend: 3.6, divCycle: '분기' },
    
    // 매월배당 (Monthly Dividend)
    { name: 'JEPI (Premium Income)', category: '매월배당', assetClass: '주식형', growth: 8.4, '1m': 0.8, '3m': 2.5, '6m': 4.8, '1y': 10.2, dividend: 7.5, divCycle: '월' },
    { name: 'JEPQ (NASDAQ Premium)', category: '매월배당', assetClass: '주식형', growth: 15.2, '1m': 2.5, '3m': 6.8, '6m': 10.2, '1y': 22.4, dividend: 9.2, divCycle: '월' },
    { name: 'O (Realty Income)', category: '매월배당', assetClass: '대체투자형', growth: 5.2, '1m': -0.5, '3m': 1.2, '6m': 3.5, '1y': 6.8, dividend: 5.8, divCycle: '월' },
    { name: 'MAIN (Main Street Capital)', category: '매월배당', assetClass: '주식형', growth: 18.5, '1m': 3.2, '3m': 7.5, '6m': 12.1, '1y': 25.4, dividend: 6.2, divCycle: '월' },
    { name: 'QYLD (Nasdaq 100 Covered Call)', category: '매월배당', assetClass: '주식형', growth: 2.5, '1m': 0.1, '3m': 1.2, '6m': 2.5, '1y': 4.2, dividend: 11.5, divCycle: '월' },

    // 채권 (Bonds)
    { name: 'TLT (20+ Yr Treasury)', category: '일반국채', assetClass: '채권형', growth: -8.4, '1m': -1.1, '3m': -4.2, '6m': -6.5, '1y': -12.1, dividend: 3.9, divCycle: '월' },
    { name: 'IEF (7-10 Yr Treasury)', category: '일반국채', assetClass: '채권형', growth: -2.5, '1m': -0.2, '3m': -1.1, '6m': -1.8, '1y': -3.5, dividend: 3.2, divCycle: '월' },
    { name: 'SHY (1-3 Yr Treasury)', category: '단기국채', assetClass: '채권형', growth: 2.1, '1m': 0.2, '3m': 0.5, '6m': 1.1, '1y': 2.8, dividend: 3.1, divCycle: '월' },
    { name: 'BIL (1-3 Mo Treasury)', category: '단기국채', assetClass: '채권형', growth: 4.8, '1m': 0.4, '3m': 1.2, '6m': 2.5, '1y': 5.2, dividend: 5.1, divCycle: '월' },
    { name: 'SGOV (0-3 Mo Treasury)', category: '단기국채', assetClass: '채권형', growth: 5.1, '1m': 0.4, '3m': 1.3, '6m': 2.6, '1y': 5.3, dividend: 5.2, divCycle: '월' },
    { name: 'TIP (Treasury Inflation)', category: '물가연동채', assetClass: '채권형', growth: 1.5, '1m': 0.1, '3m': 0.4, '6m': 0.8, '1y': 2.1, dividend: 2.5, divCycle: '분기' },
    { name: 'VTIP (Short-Term Inflation)', category: '물가연동채', assetClass: '채권형', growth: 2.8, '1m': 0.3, '3m': 0.7, '6m': 1.2, '1y': 3.2, dividend: 2.8, divCycle: '분기' },

    // 원자재 (Commodities)
    { name: 'GLD (Gold Shares)', category: '귀금속', assetClass: '원자재형', growth: 16.5, '1m': 2.8, '3m': 4.5, '6m': 8.2, '1y': 19.4, dividend: 0, divCycle: '-' },
    { name: 'IAU (Gold Trust)', category: '귀금속', assetClass: '원자재형', growth: 16.4, '1m': 2.7, '3m': 4.4, '6m': 8.1, '1y': 19.3, dividend: 0, divCycle: '-' },
    { name: 'SLV (Silver Trust)', category: '귀금속', assetClass: '원자재형', growth: 12.4, '1m': 3.5, '3m': 1.2, '6m': 5.8, '1y': 15.2, dividend: 0, divCycle: '-' },
    { name: 'USO (Oil Fund)', category: '에너지', assetClass: '원자재형', growth: -12.5, '1m': -3.2, '3m': -6.8, '6m': -15.2, '1y': -22.1, dividend: 0, divCycle: '-' },
    { name: 'UNG (Natural Gas)', category: '에너지', assetClass: '원자재형', growth: -35.2, '1m': -8.5, '3m': -15.2, '6m': -25.4, '1y': -45.1, dividend: 0, divCycle: '-' },
    { name: 'DBA (Agriculture)', category: '농산물', assetClass: '원자재형', growth: 8.2, '1m': 1.5, '3m': 2.8, '6m': 5.1, '1y': 10.5, dividend: 0, divCycle: '-' },
    { name: 'CORN (Corn)', category: '농산물', assetClass: '원자재형', growth: -5.4, '1m': -1.2, '3m': -2.5, '6m': -4.1, '1y': -8.2, dividend: 0, divCycle: '-' },
    { name: 'CPER (Copper)', category: '산업금속', assetClass: '원자재형', growth: 5.4, '1m': 0.8, '3m': 1.5, '6m': 3.2, '1y': 7.8, dividend: 0, divCycle: '-' },
    { name: 'DBB (Base Metals)', category: '산업금속', assetClass: '원자재형', growth: 4.2, '1m': 0.5, '3m': 1.2, '6m': 2.5, '1y': 6.1, dividend: 0, divCycle: '-' }
  ]
};

// Application State
let currentState = {
  market: 'domestic',
  category: '인기검색',
  sortField: 'popularity',
  sortOrder: 'desc'
};

const DOMESTIC_CATEGORIES = ['인기검색', '거래대금', '상승률', '하락률', '운용규모', '배당금'];
const US_CATEGORIES = ['고배당', '매월배당', '일반국채', '단기국채', '물가연동채', '귀금속', '에너지', '농산물', '산업금속'];
const ASSET_CATEGORIES = ['주식형', '채권형', '원자재형', '혼합자산형', '대체투자형'];

// DOM Elements
const etfList = document.getElementById('etf-list');
const categoryPills = document.getElementById('category-pills');
const navButtons = document.querySelectorAll('.nav-btn');
const tableHeaders = document.querySelectorAll('th.sortable');

function init() {
  renderCategories();
  applyCategoryLogic();
  renderTable();
  setupEventListeners();
}

function renderCategories() {
  let categories = [];
  if (currentState.market === 'domestic') {
    categories = DOMESTIC_CATEGORIES;
  } else if (currentState.market === 'us') {
    categories = US_CATEGORIES;
  } else {
    categories = ASSET_CATEGORIES;
  }

  categoryPills.innerHTML = categories.map(cat => `
    <button class="pill ${currentState.category === cat ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
}

function applyCategoryLogic() {
  if (currentState.market === 'domestic') {
    switch(currentState.category) {
      case '인기검색': currentState.sortField = 'popularity'; currentState.sortOrder = 'desc'; break;
      case '거래대금': currentState.sortField = 'volume'; currentState.sortOrder = 'desc'; break;
      case '상승률': currentState.sortField = 'growth'; currentState.sortOrder = 'desc'; break;
      case '하락률': currentState.sortField = 'growth'; currentState.sortOrder = 'asc'; break;
      case '운용규모': currentState.sortField = 'aum'; currentState.sortOrder = 'desc'; break;
      case '배당금': currentState.sortField = 'dividend'; currentState.sortOrder = 'desc'; break;
    }
  } else {
    currentState.sortField = 'growth';
    currentState.sortOrder = 'desc';
  }
}

function renderTable() {
  let data = [];
  
  if (currentState.market === 'asset') {
    data = [...etfData.domestic, ...etfData.us]
           .filter(item => item.assetClass === currentState.category);
  } else {
    data = [...etfData[currentState.market]];
    if (currentState.market === 'us' || (currentState.market === 'domestic' && !DOMESTIC_CATEGORIES.includes(currentState.category))) {
        data = data.filter(item => item.category === currentState.category);
    }
  }

  // Sorting
  data.sort((a, b) => {
    let valA = a[currentState.sortField] || 0;
    let valB = b[currentState.sortField] || 0;
    if (currentState.sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Rendering
  etfList.innerHTML = data.map(etf => `
    <tr>
      <td class="etf-name">
        ${etf.name}
        ${etf.popularity > 95 ? `<span class="rank-badge">HOT</span>` : ''}
      </td>
      <td>
        ${currentState.market === 'asset' ? 
          `<span class="tag-market">${etf.aum ? '국내' : '미국'}</span> ${etf.category}` : 
          `<span class="metric-label">${getMetricLabel()}:</span> ${formatMetric(etf)}`
        }
      </td>
      <td class="${etf.growth >= 0 ? 'val-positive' : 'val-negative'}">${etf.growth}%</td>
      <td class="${etf['1m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1m']}%</td>
      <td class="${etf['3m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['3m']}%</td>
      <td class="${etf['6m'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['6m']}%</td>
      <td class="${etf['1y'] >= 0 ? 'val-positive' : 'val-negative'}">${etf['1y']}%</td>
    </tr>
  `).join('');
}

function getMetricLabel() {
    switch(currentState.category) {
        case '거래대금': return '거래';
        case '운용규모': return '규모';
        case '배당금': return '배당';
        case '인기검색': return '지수';
        default: return '구분';
    }
}

function formatMetric(etf) {
    if (currentState.market === 'us') return `${etf.dividend}% (${etf.divCycle})`;
    switch(currentState.category) {
        case '거래대금': return `${etf.volume.toLocaleString()}억`;
        case '운용규모': return `${(etf.aum / 10000).toFixed(1)}조`;
        case '배당금': return `${etf.dividend}% (${etf.divCycle})`;
        default: return etf.category;
    }
}

function setupEventListeners() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentState.market = btn.dataset.market;
      
      if (currentState.market === 'domestic') currentState.category = '인기검색';
      else if (currentState.market === 'us') currentState.category = '고배당';
      else currentState.category = '주식형';
      
      renderCategories();
      applyCategoryLogic();
      renderTable();
    });
  });

  categoryPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      currentState.category = e.target.dataset.category;
      applyCategoryLogic();
      renderTable();
    }
  });

  tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (currentState.sortField === field) {
        currentState.sortOrder = currentState.sortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        currentState.sortField = field;
        currentState.sortOrder = 'desc';
      }
      renderTable();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
