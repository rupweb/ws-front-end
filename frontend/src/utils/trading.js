export const CANONICAL_TRADE_SYMBOLS = [
  'EURUSD',
  'GBPUSD',
  'EURGBP',
  'USDCAD',
  'EURCAD',
  'GBPCAD'
];

export const TRADE_SYMBOLS = [
  ...CANONICAL_TRADE_SYMBOLS,
  ...CANONICAL_TRADE_SYMBOLS.map((symbol) => `${symbol.substring(3, 6)}${symbol.substring(0, 3)}`)
].filter((symbol, index, values) => values.indexOf(symbol) === index);

export const EMPTY_SALES_QUOTE = {
  fxRate: 0,
  secondaryAmount: 0,
  symbol: '',
  quoteRequestID: '',
  quoteID: '',
  clientID: '',
  fromCurrency: ''
};

export const EMPTY_TRADING_QUOTE = {
  transactionType: '',
  symbol: '',
  quoteRequestID: '',
  quoteID: '',
  clientID: '',
  legs: [],
  fxRate: null,
  secondaryAmount: null,
  currency: ''
};

export const EMPTY_EXECUTION_REPORT = {
  kind: '',
  executedAt: '',
  dealID: '',
  transactionType: '',
  amount: null,
  currency: '',
  symbol: '',
  deliveryDate: '',
  secondaryCurrency: '',
  rate: null,
  secondaryAmount: null,
  legs: []
};

export const EMPTY_ERROR = {
  amount: null,
  currency: '',
  side: '',
  symbol: '',
  deliveryDate: '',
  transactTime: '',
  quoteRequestID: '',
  quoteID: '',
  dealRequestID: '',
  dealID: '',
  rate: null,
  secondaryAmount: null,
  clientID: '',
  message: ''
};

export const normalizeTradeSymbol = (value = '') =>
  value.replace('/', '').trim().toUpperCase();

export const reverseTradeSymbol = (symbol = '') =>
  symbol.length === 6 ? `${symbol.substring(3, 6)}${symbol.substring(0, 3)}` : '';

export const getCanonicalTradeSymbol = (symbol = '') => {
  const normalized = normalizeTradeSymbol(symbol);
  if (CANONICAL_TRADE_SYMBOLS.includes(normalized)) {
    return normalized;
  }

  const reversed = reverseTradeSymbol(normalized);
  if (CANONICAL_TRADE_SYMBOLS.includes(reversed)) {
    return reversed;
  }

  return null;
};

export const isSupportedTradeSymbol = (symbol = '') =>
  TRADE_SYMBOLS.includes(normalizeTradeSymbol(symbol));

export const getTradeSymbolCurrencies = (symbol = '') => {
  const normalized = normalizeTradeSymbol(symbol);
  if (normalized.length !== 6) {
    return [];
  }

  return [normalized.substring(0, 3), normalized.substring(3, 6)];
};

export const getDefaultTradeCurrency = (symbol = '', currentCurrency = '') => {
  const currencies = getTradeSymbolCurrencies(symbol);
  if (currencies.includes(currentCurrency)) {
    return currentCurrency;
  }

  return currencies[0] || '';
};

export const decimalToNumber = (value) => {
  if (!value || typeof value !== 'object' || value.mantissa === undefined || value.exponent === undefined) {
    return null;
  }

  const mantissa = typeof value.mantissa === 'bigint' ? Number(value.mantissa) : value.mantissa;
  const exponent = typeof value.exponent === 'bigint' ? Number(value.exponent) : value.exponent;

  return mantissa * Math.pow(10, exponent);
};

export const formatTradeNumber = (value, digits) => {
  const numericValue = typeof value === 'number' ? value : decimalToNumber(value);
  if (numericValue === null || Number.isNaN(numericValue)) {
    return '';
  }

  return numericValue.toFixed(digits);
};

export const getExecutableTradePrice = ({ quotedLeg, symbol, side, currency }) => {
  if (!quotedLeg) {
    return null;
  }

  const [base, terms] = getTradeSymbolCurrencies(symbol);
  if (!base || !terms) {
    return null;
  }

  if (currency === base) {
    return side === 'SELL' ? quotedLeg.bid : quotedLeg.offer;
  }

  if (currency === terms) {
    return side === 'SELL' ? quotedLeg.offer : quotedLeg.bid;
  }

  return null;
};

export const getExecutableTradeSpot = ({ quotedLeg, symbol, side, currency }) => {
  if (!quotedLeg) {
    return null;
  }

  const [base, terms] = getTradeSymbolCurrencies(symbol);
  if (!base || !terms) {
    return null;
  }

  if (currency === base) {
    return side === 'SELL' ? quotedLeg.spotBid : quotedLeg.spotOffer;
  }

  if (currency === terms) {
    return side === 'SELL' ? quotedLeg.spotOffer : quotedLeg.spotBid;
  }

  return null;
};

export const getExecutableTradeFwd = ({ quotedLeg, symbol, side, currency }) => {
  if (!quotedLeg) {
    return null;
  }

  const [base, terms] = getTradeSymbolCurrencies(symbol);
  if (!base || !terms) {
    return null;
  }

  if (currency === base) {
    return side === 'SELL' ? quotedLeg.fwdBid : quotedLeg.fwdOffer;
  }

  if (currency === terms) {
    return side === 'SELL' ? quotedLeg.fwdOffer : quotedLeg.fwdBid;
  }

  return null;
};

export const calculateTradeCounterAmount = ({ symbol, currency, amount, price }) => {
  const [base, terms] = getTradeSymbolCurrencies(symbol);
  const numericAmount = typeof amount === 'number' ? amount : decimalToNumber(amount);
  const numericPrice = typeof price === 'number' ? price : decimalToNumber(price);

  if (!base || !terms || numericAmount === null || numericPrice === null || numericPrice === 0) {
    return null;
  }

  if (currency === base) {
    return Math.round(numericAmount * numericPrice * 100) / 100;
  }

  if (currency === terms) {
    return Math.round((numericAmount / numericPrice) * 100) / 100;
  }

  return null;
};

export const buildTradeQuoteRows = (quote) => {
  if (!quote?.symbol || !Array.isArray(quote.legs)) {
    return [];
  }

  const [base, terms] = getTradeSymbolCurrencies(quote.symbol);

  return quote.legs.map((leg, index) => {
    const rate = getExecutableTradePrice({
      quotedLeg: leg,
      symbol: quote.symbol,
      side: leg.side,
      currency: leg.currency
    });
    const counterAmount = calculateTradeCounterAmount({
      symbol: quote.symbol,
      currency: leg.currency,
      amount: leg.amount,
      price: rate
    });

    return {
      key: `${quote.quoteID || quote.quoteRequestID || 'quote'}-${index}`,
      index: index + 1,
      side: leg.side,
      amount: formatTradeNumber(leg.amount, 2),
      currency: leg.currency,
      valueDate: leg.valueDate,
      rate: formatTradeNumber(rate, 5),
      counterAmount: counterAmount === null ? '' : counterAmount.toFixed(2),
      counterCurrency: leg.currency === base ? terms : base
    };
  });
};
