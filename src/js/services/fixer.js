import axios from 'axios';


const BASE_URL = 'https://data.fixer.io/api/latest?access_key=36335f41d4175ccf785ead6a473fc526&base=USD';

export const getRate = async (currency) => {
  const url = `${BASE_URL}&symbols=${currency}`;
  try {
    const { data } = await axios.get(url);
    if (data.success) {
      return data.rates[currency];
    }
    throw new Error('Invalid currency code');
  } catch (e) {
    throw e;
  }
};


export const convert = () => {

};
