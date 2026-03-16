const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function fluctuate(val) {
  const change = (Math.random() * 2 - 1) * 0.5; // -0.5% to +0.5%
  return parseFloat((val + change).toFixed(2));
}

function updateItems(items) {
  return items.map(item => ({
    ...item,
    growth: fluctuate(item.growth),
    '1m': fluctuate(item['1m']),
    '3m': fluctuate(item['3m']),
    '6m': fluctuate(item['6m']),
    '1y': fluctuate(item['1y']),
    // volume, aum, popularity can also fluctuate
    volume: item.volume ? Math.floor(item.volume * (1 + (Math.random() * 0.1 - 0.05))) : item.volume,
    aum: item.aum ? Math.floor(item.aum * (1 + (Math.random() * 0.02 - 0.01))) : item.aum,
    popularity: item.popularity ? Math.min(100, Math.max(0, Math.floor(item.popularity + (Math.random() * 4 - 2)))) : item.popularity
  }));
}

data.etfData.domestic = updateItems(data.etfData.domestic);
data.etfData.us = updateItems(data.etfData.us);

const now = new Date();
// Adjust to KST (UTC+9)
const kstOffset = 9 * 60 * 60 * 1000;
const kstDate = new Date(now.getTime() + kstOffset);
const year = kstDate.getUTCFullYear();
const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
const day = String(kstDate.getUTCDate()).padStart(2, '0');

data.lastUpdate = `${year}-${month}-${day} 16:00`;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Data updated for ${data.lastUpdate}`);
