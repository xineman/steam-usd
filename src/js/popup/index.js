import { getRate } from '../services/fixer';
import * as storage from '../services/storage';


const RATE = 0.86956522;

const sellInput = document.getElementById('sellAmount');
const getInput = document.getElementById('getAmount');
const rateRadioButtons = document.getElementsByClassName('settings__rate-radio');
const rateInput = document.getElementById('rateInput');

async function setupRates(method) {
  switch (method) {
    case 'api': {
      rateInput.disabled = true;
      rateInput.value = await getRate('UAH');
      break;
    }
    case 'calculate': {
      rateInput.disabled = true;
      rateInput.value = 'Will be calculated';
      break;
    }
    case 'manual': {
      rateInput.disabled = false;
      break;
    }
    default:
      break;
  }
}

function setListeners() {
  sellInput.addEventListener('keyup', function func() {
    getInput.value = (this.value * RATE).toFixed(2);
  });

  getInput.addEventListener('keyup', function func() {
    sellInput.value = (this.value / RATE).toFixed(2);
  });

  if (rateRadioButtons.length) {
    Array.from(rateRadioButtons).forEach(radio =>
      radio.addEventListener('change', async function func() {
        console.log('gonna set', this.value);
        await storage.setItems({
          rateMethod: this.value,
        });
        console.log(await storage.getItems('rateMethod'));
        setupRates(this.value);
      }));
  }

  rateInput.addEventListener('change', function func() {
    storage.setItems({
      currentRate: parseFloat(this.value),
    });
  });
}

function initUi({ rateMethod, currentRate }) {
  setListeners();
  if (currentRate && rateMethod === 'manual') {
    rateInput.value = currentRate;
  }
  setupRates(rateMethod);
}

storage.getItems(['rateMethod', 'currentRate', 'lastUpdated'])
  .then((settings) => {
    if (Object.keys(settings).length !== 3) {
      const s = {
        rateMethod: 'api',
        currentRate: null,
        lastUpdated: null,
      };
      storage.setItems(s);
      return s;
    }
    return settings;
  })
  .then(initUi);
