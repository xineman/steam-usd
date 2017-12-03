import axios from 'axios';
import { GET_USD_PRICE } from '../constants';

const parsePrice = price => parseFloat(price.replace(/,/, '.').replace(/[^\d.]/g, ''));

const getRate = async (request) => {
  let rate;
  const items = new DOMParser()
    .parseFromString(request.raw, 'text/html')
    .getElementsByClassName('market_listing_row_link');
  const { data: localRaw } = await axios.get('http://steamcommunity.com/market/');
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
      if (priceParsed > 5) {
        rate = priceLocalParsed / priceParsed;
        console.log(price, priceLocal);
        console.log(priceParsed, priceLocalParsed);
        console.log('Rate:', priceLocalParsed / priceParsed);
        break;
      }
    }
  }

  const prices = Array.from(document.getElementsByClassName('market_listing_price market_listing_price_with_fee'));
  const tooltip = document.getElementsByClassName('jqplot-highlighter-tooltip')[0];

  const observer = new MutationObserver(((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const price = parsePrice(mutation.target.childNodes[2].textContent.slice());
        mutation.target.childNodes[2].textContent = `$${(price / rate).toFixed(2)}`; // eslint-disable-line
      }
    });
  }));

  // configuration of the observer:
  const config = { attributes: true, childList: true, characterData: true };

  // pass in the target node, as well as the observer options
  observer.observe(tooltip, config);

  prices.forEach((p) => {
    const price = parsePrice(p.textContent);
    p.textContent = `$${(price / rate).toFixed(2)}`; // eslint-disable-line
  });
};

if (window.location.href.indexOf('listings') !== -1) {
  chrome.runtime.sendMessage({ type: GET_USD_PRICE });
  chrome.runtime.onMessage.addListener(getRate);
}
