import { useEffect, useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useClientIDHandling from './useClientIDHandling.js';
import useQuoteHandling from './useQuoteHandling.js';
import useDealHandling from './useDealHandlingV2.js';
import useErrorHandling from './useErrorHandling.js';
import useExecutionModal from './useExecutionModal.js';
import useErrorModal from './useErrorModal.js';
import { useWebSocket } from '../contexts/WebSocketContext.js';
import prepareQuoteRequestV2 from '../handlers/handleQuoteRequestV2.js';
import prepareDealRequestV2 from '../handlers/handleDealRequestV2.js';
import prepareQuoteCancelV2 from '../handlers/handleQuoteCancelV2.js';
import prepareReset from '../handlers/handleResetV2.js';
import {
  TRADE_SYMBOLS,
  getDefaultTradeCurrency,
  getTradeSymbolCurrencies,
  normalizeTradeSymbol
} from '../utils/trading.js';

const createLeg = (side, currency, date, amount = '') => ({
  side,
  amount,
  currency,
  date
});

const useTradeEntry = (amplifyUsername) => {
  const {
    tradingQuote,
    setTradingQuote,
    showTradingQuote,
    setShowTradingQuote,
    tradingExecutionReport,
    setTradingExecutionReport,
    showTradingExecutionReport,
    setShowTradingExecutionReport,
    tradingError,
    setTradingError,
    showTradingError,
    setShowTradingError,
    sendMessage
  } = useWebSocket();

  const [transactionType, setTransactionType] = useState('SPO');
  const [symbol, setSymbol] = useState('EURUSD');
  const [legs, setLegs] = useState([
    createLeg('BUY', getDefaultTradeCurrency('EURUSD'), addBusinessDays(new Date(), 2))
  ]);

  const currencyOptions = getTradeSymbolCurrencies(symbol);
  const symbolOptions = TRADE_SYMBOLS;

  useEffect(() => {
    const nearDate = addBusinessDays(new Date(), 2);
    const farDate = addBusinessDays(new Date(), 7);

    setLegs((previousLegs) => {
      const legCurrency = getDefaultTradeCurrency(symbol, previousLegs[0]?.currency);

      if (transactionType === 'SPO' || transactionType === 'FWD') {
        const first = previousLegs[0] || createLeg('BUY', legCurrency, nearDate);
        return [
          {
            ...first,
            side: first.side || 'BUY',
            currency: legCurrency,
            date: first.date || nearDate
          }
        ];
      }

      if (transactionType === 'SWP') {
        const first = previousLegs[0] || createLeg('BUY', legCurrency, nearDate);
        const firstSide = first.side || 'BUY';
        const second = previousLegs[1] || createLeg(firstSide === 'BUY' ? 'SELL' : 'BUY', legCurrency, farDate, first.amount || '');

        return [
          {
            ...first,
            side: firstSide,
            currency: legCurrency,
            date: first.date || nearDate
          },
          {
            ...second,
            side: firstSide === 'BUY' ? 'SELL' : 'BUY',
            currency: legCurrency,
            date: second.date || farDate
          }
        ];
      }

      return previousLegs.length > 0
        ? previousLegs.map((leg, index) => ({
            ...leg,
            side: leg.side || (index === 0 ? 'BUY' : 'SELL'),
            currency: legCurrency,
            date: leg.date || nearDate
          }))
        : [createLeg('BUY', legCurrency, nearDate)];
    });
  }, [symbol, transactionType]);

  const [clientID, setClientID] = useState(amplifyUsername || '');
  const [clientIDMessage, setClientIDMessage] = useState('');
  const [showClientID, setShowClientID] = useState(false);
  const resolvedClientID = (clientID || amplifyUsername || '').trim();

  useEffect(() => {
    if (!clientID && amplifyUsername) {
      setClientID(amplifyUsername);
    }
  }, [amplifyUsername, clientID]);

  const [executionReportMessage, setExecutionReportMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { handleClientIDCheck, handleClientIDModalClose } = useClientIDHandling(
    amplifyUsername,
    clientID,
    setClientIDMessage,
    setShowClientID
  );
  const { handleQuoteMessage } = useQuoteHandling(setTradingQuote);
  const { handleExecutionReport } = useDealHandling(setTradingExecutionReport, setExecutionReportMessage, setShowTradingExecutionReport);
  const { handleErrorMessage } = useErrorHandling(setTradingError, setErrorMessage, setShowTradingError);
  const { handleExecutionModalClose } = useExecutionModal(setShowTradingExecutionReport);
  const { handleErrorModalClose } = useErrorModal(setShowTradingError);

  const handleQuoteRequest = () =>
    prepareQuoteRequestV2({
      transactionType,
      symbol,
      clientID: resolvedClientID,
      legs,
      sendMessage,
      handleClientIDCheck
    });

  const handleQuoteCancel = () =>
    prepareQuoteCancelV2({
      transactionType: tradingQuote?.transactionType || transactionType,
      symbol: tradingQuote?.symbol || symbol,
      quoteRequestID: tradingQuote?.quoteRequestID,
      clientID: resolvedClientID,
      sendMessage
    });

  const handleDealRequest = () =>
    prepareDealRequestV2({
      transactionType,
      symbol: tradingQuote?.symbol || symbol,
      clientID: resolvedClientID,
      quoteRequestID: tradingQuote?.quoteRequestID,
      quoteID: tradingQuote?.quoteID,
      quote: tradingQuote,
      legs,
      sendMessage
    });

  const handleReset = () =>
    prepareReset({
      setQuote: setTradingQuote,
      setShowQuote: setShowTradingQuote,
      setExecutionReport: setTradingExecutionReport,
      setShowExecutionReport: setShowTradingExecutionReport,
      setError: setTradingError,
      setShowError: setShowTradingError,
      setLegs,
      setSymbol,
      setTransactionType,
      setClientID
    });

  const handleSymbolChange = (value) => {
    setSymbol(normalizeTradeSymbol(value));
  };

  const handleTradeCurrencyChange = (currency) => {
    setLegs((previousLegs) =>
      previousLegs.map((leg) => ({
        ...leg,
        currency
      }))
    );
  };

  return {
    transactionType,
    setTransactionType,
    symbol,
    setSymbol: handleSymbolChange,
    symbolOptions,
    currencyOptions,
    legs,
    setLegs,
    handleTradeCurrencyChange,
    clientID,
    setClientID,
    quote: tradingQuote,
    showQuote: showTradingQuote,
    setShowQuote: setShowTradingQuote,
    executionReport: tradingExecutionReport,
    showExecutionReport: showTradingExecutionReport,
    setShowExecutionReport: setShowTradingExecutionReport,
    error: tradingError,
    showError: showTradingError,
    setShowError: setShowTradingError,
    handleQuoteRequest,
    handleQuoteCancel,
    handleDealRequest,
    handleReset,
    clientIDMessage,
    showClientID,
    handleClientIDModalClose,
    handleQuoteMessage,
    handleExecutionReport,
    executionReportMessage,
    handleExecutionModalClose,
    handleErrorMessage,
    errorMessage,
    handleErrorModalClose
  };
};

export default useTradeEntry;
