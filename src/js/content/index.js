// const axios = require('axios');

// axios.get('http://steamcommunity.com/market/listings/730/%E2%98%85%20Karambit%20%7C%20Slaughter%20%28Minimal%20Wear%29')
//   .then(({ data }) => console.log(data));

chrome.runtime.sendMessage({ greeting: 'hello' }, (response) => { // eslint-disable-line
  console.log(response);
});

chrome.runtime.onMessage.addListener( // eslint-disable-line
  (request, sender) => {
    console.log(sender.tab ?
      `from a content script:${sender.tab.url}` :
      'from the extension');
    console.log(request.greeting);
  });

const prices = Array.from(document.getElementsByClassName('market_listing_price market_listing_price_with_fee'));
const tooltip = document.getElementsByClassName('jqplot-highlighter-tooltip')[0];

const observer = new MutationObserver(((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      let text = mutation.target.childNodes[2].textContent.slice();
      text = text
        .replace(/ /g, '')
        .replace(',', '.')
        .substring(0, text.length - 1);
      mutation.target.childNodes[2].textContent = `$${(parseFloat(text) / 26.85).toFixed(2)}`; // eslint-disable-line
    }
  });
}));

// configuration of the observer:
const config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(tooltip, config);


prices.forEach((p) => {
  let val = p.textContent.trim();
  val = val
    .replace(/ /g, '')
    .replace(',', '.')
    .substring(0, val.length - 1);
  p.textContent = `$${(parseFloat(val) / 26.85).toFixed(2)}`; // eslint-disable-line
});
