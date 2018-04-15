import axios from 'axios';
import { GET_USD_PRICE } from '../constants';

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.tabId === -1) {
      return { requestHeaders: details.requestHeaders.filter(h => h.name !== 'Cookie') };
    }
    return undefined;
  },
  { urls: ['*://steamcommunity.com/market?rate=1'] },
  ['blocking', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId === -1) {
      return { responseHeaders: details.responseHeaders.filter(h => h.name !== 'Set-Cookie') };
    }
    return undefined;
  },
  { urls: ['*://steamcommunity.com/market?rate=1'] },
  ['blocking', 'responseHeaders']);

chrome.runtime.onMessage.addListener(
  async (message, sender) => {
    if (message.type === GET_USD_PRICE) {
      const { data: raw } = await axios.get('https://steamcommunity.com/market?rate=1');
      chrome.tabs.sendMessage(sender.tab.id, { raw });
    }
  });
