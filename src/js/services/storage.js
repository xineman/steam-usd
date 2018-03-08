export const getItems = (items) => {
  const handler = (resolve) => {
    chrome.storage.sync.get(items, (result) => {
      console.log('res', result);
      resolve(result);
    });
  };
  return new Promise(handler);
};

export const setItems = (item) => {
  const handler = (resolve) => {
    chrome.storage.sync.set(item, () => {
      resolve();
    });
  };
  return new Promise(handler);
};
