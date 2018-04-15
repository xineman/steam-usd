import axios from 'axios';
import { GET_USD_PRICE } from '../constants';

const parsePrice = price => parseFloat(price.replace(/,/, '.').replace(/[^\d.]/g, ''));

const updateListings = (rate) => {
  const prices = Array.from(document.getElementsByClassName('market_listing_price market_listing_price_with_fee'));
  prices.forEach((p) => {
    const price = parsePrice(p.textContent);
    p.textContent = `$${(price / rate).toFixed(2)} (${p.textContent.trim()})`; // eslint-disable-line
  });
};

const observeChartTooltip = (rate) => {
  const tooltip = document.getElementsByClassName('jqplot-highlighter-tooltip')[0];
  const observer = new MutationObserver(((mutations) => {
    mutations.forEach(({ target: { childNodes: c } }) => {
      if (c[2]) {
        const price = parsePrice(c[2].textContent.slice());
        c[2].textContent = `$${(price / rate).toFixed(2)} (${c[2].textContent.trim()})`; // eslint-disable-line
      }
    });
  }));
  const config = { childList: true };
  observer.observe(tooltip, config);
};

const observeChart = (rate) => {
  const observer = new MutationObserver((() => {
    observeChartTooltip(rate);
  }));
  const historyBlock = document.getElementById('pricehistory');
  const config = { childList: true };
  observer.observe(historyBlock, config);
  observeChartTooltip(rate);
};

const updateOrders = (rate) => {
  const table = document.getElementById('market_commodity_buyreqeusts_table');
  const top = document.getElementById('market_commodity_buyrequests').lastElementChild;
  const orders = Array.from(table.firstElementChild.firstChild.children).slice(1);
  orders.forEach(({ firstElementChild: label }) => {
    const price = parsePrice(label.textContent);
    label.textContent = `$${(price / rate).toFixed(2)} (${label.textContent.trim()})`; // eslint-disable-line
  });
  top.textContent = `$${(parsePrice(top.textContent) / rate).toFixed(2)} (${top.textContent.trim()})`;
};

const observeOrders = (rate) => {
  const table = document.getElementById('market_commodity_buyreqeusts_table');
  const top = document.getElementById('market_commodity_buyrequests').lastElementChild;
  const observer = new MutationObserver(((mutations) => {
    mutations.forEach(() => {
      updateOrders(rate);
    });
  }));
  const config = { childList: true };
  observer.observe(table, config);
  observer.observe(top, config);
};

const displayRate = (rate) => {
  const el = document.createElement('p');
  el.innerText = `Rate: ${rate.toFixed(2)}`;
  el.className = 'extension__rate';
  document.getElementsByTagName('body')[0].appendChild(el);
};

const getRate = async (request) => {
  let rate;
  const items = new DOMParser()
    .parseFromString(request.raw, 'text/html')
    .getElementsByClassName('market_listing_row_link');
  const { data: localRaw } = await axios.get('https://steamcommunity.com/market/');
  const localItems = new DOMParser()
    .parseFromString(localRaw, 'text/html')
    .getElementsByClassName('market_listing_row_link');

  for (let i = 0; i < items.length; i += 1) {
    if (items[i].getAttribute('href') ===
      localItems[i].getAttribute('href')) {
      const price = items[i].getElementsByClassName('normal_price')[1].textContent;
      const priceLocal = localItems[i].getElementsByClassName('normal_price')[1].textContent;
      const priceParsed = parsePrice(price);
      const priceLocalParsed = parsePrice(priceLocal);
      if (priceParsed > 8) {
        rate = priceLocalParsed / priceParsed;
        // console.log(price, priceLocal);
        // console.log(priceParsed, priceLocalParsed);
        // console.log('Rate:', priceLocalParsed / priceParsed);
        break;
      }
    }
  }
  observeChart(rate);
  updateListings(rate);
  updateOrders(rate);
  observeOrders(rate);
  displayRate(rate);
};

if (window.location.href.indexOf('listings') !== -1) {
  chrome.runtime.onMessage.addListener(getRate);
  chrome.runtime.sendMessage({ type: GET_USD_PRICE });
}
