// utils.js
export const currencyRates = {
    EURUSD: { bid: 1.0820, offer: 1.0840 },
    GBPUSD: { bid: 1.2510, offer: 1.2540 },
    EURGBP: { bid: 0.8570, offer: 0.8590 },
    USDCAD: { bid: 1.3760, offer: 1.3800 },
    EURCAD: { bid: 1.4938, offer: 1.4980 },
    GBPCAD: { bid: 1.7440, offer: 1.7460 }
  };
  
  export const getConversionRate = (fromCurrency, toCurrency, rates) => {
    if (fromCurrency === 'EUR' && toCurrency === 'USD') return rates.EURUSD.bid;
    if (fromCurrency === 'USD' && toCurrency === 'EUR') return rates.EURUSD.offer;
    if (fromCurrency === 'GBP' && toCurrency === 'USD') return rates.GBPUSD.bid;
    if (fromCurrency === 'USD' && toCurrency === 'GBP') return rates.GBPUSD.offer;
    if (fromCurrency === 'EUR' && toCurrency === 'GBP') return rates.EURGBP.bid;
    if (fromCurrency === 'GBP' && toCurrency === 'EUR') return rates.EURGBP.offer;
    if (fromCurrency === 'USD' && toCurrency === 'CAD') return rates.USDCAD.offer;
    if (fromCurrency === 'CAD' && toCurrency === 'USD') return rates.USDCAD.bid;
    if (fromCurrency === 'EUR' && toCurrency === 'CAD') return rates.EURCAD.offer;
    if (fromCurrency === 'CAD' && toCurrency === 'EUR') return rates.EURCAD.bid;
    if (fromCurrency === 'GBP' && toCurrency === 'CAD') return rates.GBPCAD.offer;
    if (fromCurrency === 'CAD' && toCurrency === 'GBP') return rates.GBPCAD.bid;
    return 1;
  };
  
  export const isWeekday = date => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  
  export const addBusinessDays = (date, days) => {
    let count = 0;
    let result = new Date(date);
    while (count < days) {
      result.setDate(result.getDate() + 1);
      if (isWeekday(result)) {
        count++;
      }
    }
    return result;
  };
  