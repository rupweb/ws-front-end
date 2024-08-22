import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useFormValidation from './useFormValidation.js';
import useKycStatus from './useKycStatus.js';
import useKycHandling from './useKycHandling.js';
import useQuoteHandling from './useQuoteHandling.js';
import useDealHandling from './useDealHandling.js';
import useExecutionModal from './useExecutionModal.js';
import { useWebSocket } from '../contexts/WebSocketContext.js'; 
import prepareQuoteRequest from '../handlers/handleQuoteRequest.js';
import prepareDealRequest from '../handlers/handleDealRequest.js';
import prepareReset from '../handlers/handleReset.js';

const useCurrencyConversion = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR'); // Default from ccy is EUR
  const [toCurrency, setToCurrency] = useState('USD'); // Default to ccy is USD
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));

  // Panels on the screen
  const [showQuote, setShowQuote] = useState(false);
  const [showExecute, setShowExecute] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // KYC status
  const { kycStatus, setKycStatus } = useKycStatus();
  const isFormValid = useFormValidation(fromCurrency, toCurrency, amount);
  const [kycMessage, setKycMessage] = useState('');
  const [showKyc, setShowKyc] = useState(false);

  // Align with websocket
  const { quoteData, setQuoteData, dealData, setDealData, sendMessage } = useWebSocket();

  // Execution message
  const [executionMessage, setExecutionMessage] = useState('');

  const { handleKycCheck, handleKycModalClose } = useKycHandling(
    setKycStatus,
    setKycMessage,
    setShowKyc
  );

  const { handleQuoteMessage } = useQuoteHandling(setQuoteData);
  const { handleDealMessage } = useDealHandling(setDealData, setExecutionMessage, setShowReport);
  const { handleExecutionModalClose } = useExecutionModal(setShowReport);

  const handleQuoteRequest = () => prepareQuoteRequest({
    kycStatus,
    amount,
    selectedDate,
    toCurrency,
    fromCurrency,
    sendMessage,
    handleKycCheck,
    setShowQuote,
    setShowExecute,
  });

  const handleDealRequest = () => prepareDealRequest({
    amount,
    toCurrency,
    selectedDate,
    fromCurrency,
    fxRate: quoteData.fxRate,
    secondaryAmount: quoteData.secondaryAmount,
    symbol: quoteData.symbol,
    quoteRequestID: quoteData.quoteRequestID,
    quoteID: quoteData.quoteID,
    sendMessage,
    setShowReport
  });

  const handleReset = () => prepareReset({
    setFromCurrency,
    setToCurrency,
    setAmount,
    setSelectedDate,
    setShowExecute,
    setKycStatus,
    setQuoteData,
    setShowQuote
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
    showQuote,
    showExecute,
    showReport,
    isFormValid,
    kycStatus,
    setKycStatus,
    kycMessage,
    showKyc,
    handleKycModalClose,
    handleQuoteRequest,
    handleQuoteMessage,
    handleDealRequest,
    handleDealMessage,
    handleReset,
    executionMessage,
    handleExecutionModalClose,
    quoteData, 
    dealData // Expose data 
  };
};

export default useCurrencyConversion;
