const RATE = 0.86956522;
const sellInput = document.getElementById('sellAmount');
const getInput = document.getElementById('getAmount');
const sellConverted = document.getElementById('sellConverted');
const getConverted = document.getElementById('getConverted');
const rateInput = document.getElementById('rateInput');

let rate = 28;

rateInput.addEventListener('keyup', function func() {
  rate = parseFloat(this.value);
  getConverted.textContent = (getInput.value * rate).toFixed(2);
  sellConverted.textContent = (sellInput.value * rate).toFixed(2);
});

sellInput.addEventListener('keyup', function func() {
  getInput.value = (this.value * RATE).toFixed(2);
  sellConverted.textContent = (this.value * rate).toFixed(2);
  getConverted.textContent = ((this.value * RATE) * rate).toFixed(2);
});

getInput.addEventListener('keyup', function func() {
  sellInput.value = (this.value / RATE).toFixed(2);
  getConverted.textContent = (this.value * rate).toFixed(2);
  sellConverted.textContent = ((this.value / RATE) * rate).toFixed(2);
});

