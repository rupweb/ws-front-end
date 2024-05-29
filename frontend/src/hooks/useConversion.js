import { useState } from 'react';
import { getConversionRate, currencyRates } from '../utils/utils';

const useConversion = (fromCurrency, toCurrency, amount) => {
  const [conversionRate, setConversionRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const convert = () => {
    const rate = getConversionRate(fromCurrency, toCurrency, currencyRates);
    setConversionRate(rate);

    let converted;
    const pair = `${fromCurrency}${toCurrency}`;
    const reversePair = `${toCurrency}${fromCurrency}`;

    if (currencyRates[pair]) {
      converted = amount / rate;
    } else if (currencyRates[reversePair]) {
      converted = amount * rate;
    } else {
      alert('Currency pair not supported');
      return;
    }

    setConvertedAmount(converted);
    return { rate, converted };
  };

  return {
    conversionRate,
    convertedAmount,
    convert
  };
};

export default useConversion;
