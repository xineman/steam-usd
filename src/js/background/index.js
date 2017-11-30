const axios = require('axios');

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (let i = 0; i < details.requestHeaders.length; i += 1) {
      if (details.requestHeaders[i].name === 'Cookie') {
        details.requestHeaders.splice(i, 1);
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ['*://steamcommunity.com/*'] },
  ['blocking', 'requestHeaders']);
chrome.runtime.onMessage.addListener(
  () => {
    axios.get('http://steamcommunity.com/market/listings/730/%E2%98%85%20Karambit%20%7C%20Slaughter%20%28Minimal%20Wear%29')
      .then(({ data }) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { greeting: data }, (response) => {
            console.log(response.farewell);
          });
        });
      });
  });
