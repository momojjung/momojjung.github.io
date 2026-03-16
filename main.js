// [최종 실제 데이터 기반 보정] 국내 및 미국 ETF 정보
let etfData = {};
let benchmarks = {};
let lastUpdateStr = '';

let state = {
  market: 'domestic',
  category: '인기검색',
  subCategory: '', // '월', '분기', '반기', '연'
  sortField: 'popularity',
  sortOrder: 'desc',
  searchQuery: '',
  watchlist: new Set(JSON.parse(localStorage.getItem('etf-watchlist') || '[]'))
};

// 모든 ETF를 대상으로 하는 순위 항목들 (Global Ranking Criteria)
const RANK_PILLS = ['인기검색', '거래대금', '상승률', '하락률', '운용규모', '배당금'];
const DOMESTIC_SECTORS = ['지수', '배당', '채권', '리츠', '테마'];
const US_SECTORS = ['고배당', '매월배당', '일반국채', '단기국채', '귀금속', '에너지'];
const ASSET_CATEGORIES = ['주식형', '채권형', '원자재형', '혼합자산형', '대체투자형'];

const DIVIDEND_SUB_CATEGORIES = [
    { label: '월 배당 (매달)', value: '월' },
    { label: '분기 배당 (연 4회)', value: '분기' },
    { label: '반기 배당 (연 2회)', value: '반기' },
    { label: '연 배당 (연 1회)', value: '연' }
];

async function init() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    etfData = data.etfData;
    benchmarks = data.benchmarks;
    lastUpdateStr = data.lastUpdate;
    
    renderCategories();
    updateDashboard();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load ETF data:', error);
  }
}

function updateDashboard() {
  if (!etfData.domestic) return;
  applyCategoryLogic();
  const filteredData = getFilteredAndSortedData();
  renderSummary(filteredData);
  renderTable(filteredData);
  updateLastUpdateTime();
}

function updateLastUpdateTime() {
  const lastUpdateEl = document.getElementById('last-update-time');
  if (lastUpdateEl) lastUpdateEl.textContent = `마지막 업데이트: ${lastUpdateStr}`;
}

function getFilteredAndSortedData() {
  let data = [];
  
  // 1. 데이터 소스 결정 (순위 항목일 경우 전체 ETF 대상, 아니면 시장별 대상)
  if (RANK_PILLS.includes(state.category)) {
      data = [...etfData.domestic, ...etfData.us];
  } else if (state.market === 'asset') {
      data = [...etfData.domestic, ...etfData.us].filter(item => item.assetClass === state.category);
  } else {
      data = [...etfData[state.market]];
      if (DOMESTIC_SECTORS.includes(state.category) || US_SECTORS.includes(state.category)) {
          data = data.filter(item => item.category === state.category);
      }
  }

  // 2. 배당금 전용 필터링 및 정렬 기준 강화
  if (state.category === '배당금') {
      if (state.subCategory) {
          // 특정 주기의 배당금만 노출 (월, 분기, 반기, 연 중 선택한 것만)
          data = data.filter(item => item.divCycle === state.subCategory && item.dividend > 0);
      } else {
          // 전체 배당금 탭에서는 배당금이 있는 모든 종목 노출
          data = data.filter(item => item.dividend > 0);
      }
  }

  // 3. 검색어 필터링
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }

  // 4. 정렬 로직
  data.sort((a, b) => {
    const aFav = state.watchlist.has(a.name) ? 1 : 0;
    const bFav = state.watchlist.has(b.name) ? 1 : 0;
    if (aFav !== bFav) return bFav - aFav;

    // 배당금 순위는 오직 배당금액으로만 (성장률 무시)
    if (state.category === '배당금') {
        let valA = a.dividend || 0;
        let valB = b.dividend || 0;
        return state.sortOrder === 'asc' ? valA - valB : valB - valA;
    }

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
  
  const isDomestic = etfData.domestic.some(e => e.name === topDiv.name);
  const divSign = isDomestic ? '₩' : '$';
  document.getElementById('top-div-val').textContent = `${divSign}${topDiv.dividend}`;
  document.getElementById('top-div-name').textContent = topDiv.name;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');

  etfList.innerHTML = data.map(etf => {
    const isDom = etfData.domestic.some(e => e.name === etf.name);
    const divSign = isDom ? '₩' : '$';
    const benchmark = isDom ? benchmarks.domestic : benchmarks.us;
    const isOutperforming = etf.growth > benchmark;
    
    let displayDividend = `${divSign}${etf.dividend.toLocaleString()}`;

    return `
    <tr class="${state.watchlist.has(etf.name) ? 'is-fav' : ''}">
      <td class="col-fav ${state.watchlist.has(etf.name) ? 'active' : ''}" onclick="toggleWatchlist('${etf.name}')">
        ${state.watchlist.has(etf.name) ? '★' : '☆'}
      </td>
      <td>
        <div class="etf-name">
          ${etf.name}
          ${isDom ? '<span class="market-tag tag-kr">KR</span>' : '<span class="market-tag tag-us">US</span>'}
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
            <span class="div-amount">${etf.dividend > 0 ? displayDividend : '-'}</span>
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
  let items = [];

  if (state.market === 'domestic') {
      items = [...RANK_PILLS, ...DOMESTIC_SECTORS];
  } else if (state.market === 'us') {
      items = [...RANK_PILLS, ...US_SECTORS];
  } else {
      items = ASSET_CATEGORIES;
  }

  let html = items.map(cat => `
    <button class="pill ${state.category === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>
  `).join('');

  if (state.category === '배당금') {
      html += `<div class="sub-pills-wrapper">` + DIVIDEND_SUB_CATEGORIES.map(sub => `
          <button class="pill sub-pill ${state.subCategory === sub.value ? 'active' : ''}" data-sub-category="${sub.value}">${sub.label}</button>
      `).join('') + `</div>`;
  }

  categoryPills.innerHTML = html;
}

function applyCategoryLogic() {
  switch(state.category) {
    case '인기검색': state.sortField = 'popularity'; state.sortOrder = 'desc'; break;
    case '거래대금': state.sortField = 'volume'; state.sortOrder = 'desc'; break;
    case '상승률': state.sortField = 'growth'; state.sortOrder = 'desc'; break;
    case '하락률': state.sortField = 'growth'; state.sortOrder = 'asc'; break;
    case '운용규모': state.sortField = 'aum'; state.sortOrder = 'desc'; break;
    case '배당금': 
        state.sortField = 'dividend'; 
        state.sortOrder = 'desc'; 
        break;
    default:
        state.sortField = 'growth'; state.sortOrder = 'desc';
  }
}

function setupEventListeners() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      state.category = '인기검색';
      state.subCategory = '';
      renderCategories();
      updateDashboard();
    });
  });

  document.getElementById('category-pills').addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
        if (e.target.classList.contains('sub-pill')) {
            state.subCategory = e.target.dataset.subCategory;
        } else {
            state.category = e.target.dataset.category;
            state.subCategory = ''; 
        }
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
