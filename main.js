// [Financial Magazine Edition] Real-time Analysis & Content-rich Platform
let etfData = {};
let state = {
  market: 'domestic',
  searchQuery: '',
  lang: 'ko'
};

async function init() {
  initHeroChart();
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

function initHeroChart() {
  const ctx = document.getElementById('heroChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['반도체', '배당성장', '2차전지', '인프라', '금'],
      datasets: [{
        label: '예상 수익률 (%)',
        data: [12.5, 8.2, -4.5, 15.8, 10.1],
        backgroundColor: [
          'rgba(26, 42, 64, 0.8)',
          'rgba(197, 160, 89, 0.8)',
          'rgba(214, 48, 49, 0.8)',
          'rgba(26, 42, 64, 0.8)',
          'rgba(197, 160, 89, 0.8)'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true, grid: { display: false } },
        x: { grid: { display: false } }
      }
    }
  });
}

function updateDashboard() {
  if (!etfData || !etfData.domestic) return;
  const filteredData = getFilteredData();
  renderTable(filteredData);
}

function getFilteredData() {
  let data = [...etfData[state.market]];
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    data = data.filter(item => item.name.toLowerCase().includes(query));
  }
  // Sort by Market Cap (AUM) by default
  data.sort((a, b) => b.aum - a.aum);
  return data;
}

function renderTable(data) {
  const etfList = document.getElementById('etf-list');
  if (!etfList) return;

  if (data.length === 0) {
    etfList.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 3rem;">No data found.</td></tr>';
    return;
  }

  const rows = data.slice(0, 15).map((etf, index) => {
    const isDom = state.market === 'domestic';
    const unit = isDom ? '억' : 'M';
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
  const map = { 1: '매우낮음', 2: '낮음', 3: '보통', 4: '높음', 5: '매우높음' };
  return map[risk] || '보통';
}

function setupEventListeners() {
  // Market Switcher
  document.querySelectorAll('.market-switcher button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.market-switcher button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.dataset.market;
      updateDashboard();
    });
  });

  // Search
  const searchInput = document.getElementById('etf-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      updateDashboard();
    });
  }

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
