import axios from 'axios';
import { GET_USD_PRICE } from '../constants';

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.requestHeaders.find(h => h.name === 'no-cookie')) {
      const cookies = details.requestHeaders.findIndex(h => h.name === 'Cookie');
      if (cookies) {
        details.requestHeaders.splice(cookies, 1);
        return { requestHeaders: details.requestHeaders };
      }
    }
    return undefined;
  },
  { urls: ['*://steamcommunity.com/market/*'] },
  ['blocking', 'requestHeaders']);
chrome.runtime.onMessage.addListener(
  async (message) => {
    if (message.type === GET_USD_PRICE) {
      const { data: raw } = await axios.get('http://steamcommunity.com/market/',
        { headers: { 'no-cookie': 'true' } });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { raw });
      });
    }
  });
