import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useFormValidation from './useFormValidation.js';
import useClientIDHandling from './useClientIDHandling.js';
import useQuoteHandling from './useQuoteHandling.js';
import useDealHandling from './useDealHandling.js';
import useErrorHandling from './useErrorHandling.js';
import useExecutionModal from './useExecutionModal.js';
import useErrorModal from './useErrorModal.js';
import { useWebSocket } from '../contexts/WebSocketContext.js'; 
import prepareQuoteRequest from '../handlers/handleQuoteRequest.js';
import prepareQuoteCancel from '../handlers/handleQuoteCancel.js';
import prepareDealRequest from '../handlers/handleDealRequest.js';
import prepareReset from '../handlers/handleReset.js';

const useCurrencyConversion = (amplifyUsername) => {
  // Align with websocket
  const { 
    salesQuote, 
    setSalesQuote, 
    showSalesQuote,
    setShowSalesQuote,
    salesExecutionReport, 
    setSalesExecutionReport,
    showSalesExecutionReport,
    setShowSalesExecutionReport, 
    salesError, 
    setSalesError, 
    showSalesError,
    setShowSalesError,
    sendMessage 
  } = useWebSocket();

  // Main panel variables
  const [fromCurrency, setFromCurrency] = useState('EUR'); // Default from ccy is EUR
  const [toCurrency, setToCurrency] = useState('USD'); // Default to ccy is USD
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));

  // Form validation
  const isFormValid = useFormValidation(fromCurrency, toCurrency, amount);

  // ClientID status
  const [clientID, setClientID] = useState(amplifyUsername || '');
  const [clientIDMessage, setClientIDMessage] = useState('');
  const [showClientID, setShowClientID] = useState(false);
  const resolvedClientID = (clientID || amplifyUsername || '').trim();

  // Execution message
  const [executionReportMessage, setExecutionReportMessage] = useState('');

  // Error message
  const [errorMessage, setErrorMessage] = useState('');

  const { handleClientIDCheck, handleClientIDModalClose } = useClientIDHandling(
    amplifyUsername,
    clientID,
    setClientIDMessage,
    setShowClientID
  );

  const { handleQuoteMessage } = useQuoteHandling(setSalesQuote);
  const { handleExecutionReport } = useDealHandling(setSalesExecutionReport, setExecutionReportMessage, setShowSalesExecutionReport);
  const { handleErrorMessage } = useErrorHandling(setSalesError, setErrorMessage, setShowSalesError);
  const { handleExecutionModalClose } = useExecutionModal(setShowSalesExecutionReport);
  const { handleErrorModalClose } = useErrorModal(setShowSalesError);

  const handleQuoteRequest = () => prepareQuoteRequest({
    clientID: resolvedClientID,
    amount,
    selectedDate,
    toCurrency,
    fromCurrency,
    sendMessage,
    handleClientIDCheck
  });

  const handleQuoteCancel = () => prepareQuoteCancel({
    symbol: salesQuote.symbol,
    quoteRequestID: salesQuote.quoteRequestID,
    clientID: resolvedClientID,
    sendMessage
  });

  const handleDealRequest = () => prepareDealRequest({
    amount,
    toCurrency,
    selectedDate,
    fromCurrency,
    fxRate: salesQuote.fxRate,
    secondaryAmount: salesQuote.secondaryAmount,
    symbol: salesQuote.symbol,
    quoteRequestID: salesQuote.quoteRequestID,
    quoteID: salesQuote.quoteID,
    clientID: resolvedClientID,
    sendMessage
  });

  const handleReset = () => prepareReset({
    setFromCurrency,
    setToCurrency,
    setAmount,
    setSelectedDate,
    setClientID,
    setQuote: setSalesQuote,
    setShowQuote: setShowSalesQuote,
    setExecutionReport: setSalesExecutionReport,
    setShowExecutionReport: setShowSalesExecutionReport,
    setError: setSalesError,
    setShowError: setShowSalesError
  });

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    selectedDate,
    setSelectedDate,
    isFormValid,
    clientID,
    setClientID,
    clientIDMessage,
    showClientID,
    handleClientIDModalClose,
    quote: salesQuote, 
    showQuote: showSalesQuote,
    setShowQuote: setShowSalesQuote,
    handleQuoteRequest,
    handleQuoteMessage,
    handleQuoteCancel,
    handleDealRequest,
    executionReport: salesExecutionReport,
    showExecutionReport: showSalesExecutionReport,
    setShowExecutionReport: setShowSalesExecutionReport,
    handleExecutionReport,
    executionReportMessage,
    handleExecutionModalClose,
    error: salesError,
    showError: showSalesError,
    setShowError: setShowSalesError,
    handleErrorMessage,
    errorMessage,
    handleErrorModalClose,
    handleReset,
  };
};

export default useCurrencyConversion;
