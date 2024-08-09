import { useEffect, useState } from 'react';
import { getConversionRate, currencyRates } from '../utils/utils.js';

// The onConversionUpdate uses local state to handle incoming quotes
const useConversion = (fromCurrency, toCurrency, amount, onConversionUpdate) => {
  const [conversionRate, setConversionRate] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const rate = getConversionRate(fromCurrency, toCurrency, currencyRates);
      let converted = 0;

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

      setConversionRate(rate);
      setConvertedAmount(converted);

      if (onConversionUpdate) {
        onConversionUpdate({
          conversionRate: rate,
          convertedAmount: converted,
          fromCurrency: fromCurrency,
        });
      }
    }
  }, [fromCurrency, toCurrency, amount, onConversionUpdate]);

  return {
    conversionRate,
    convertedAmount,
  };
};

export default useConversion;
