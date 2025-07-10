import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useClientIDHandling from './useClientIDHandling.js';
import useQuoteHandling from './useQuoteHandling.js';
import useDealHandling from './useDealHandling.js';
import useErrorHandling from './useErrorHandling.js';
import useExecutionModal from './useExecutionModal.js';
import useErrorModal from './useErrorModal.js';
import { useWebSocket } from '../contexts/WebSocketContext.js';

import prepareQuoteRequestV2 from '../handlers/handleQuoteRequestV2.js';
import prepareDealRequestV2 from '../handlers/handleDealRequestV2.js';
import prepareQuoteCancel from '../handlers/handleQuoteCancel.js';
import prepareReset from '../handlers/handleReset.js';

const useTradeEntry = (amplifyUsername) => {
  const {
    quote,
    setQuote,
    showQuote,
    setShowQuote,
    executionReport,
    setExecutionReport,
    showExecutionReport,
    setShowExecutionReport,
    error,
    setError,
    showError,
    setShowError,
    sendMessage
  } = useWebSocket();

  // Trade type
  const [transactionType, setTransactionType] = useState('SPO'); // SPO, FWD, SWP, MUL
  const [symbol, setSymbol] = useState('EURUSD');

  // Legs array
  const [legs, setLegs] = useState([
    {
      side: 'BUY',
      amount: '',
      currency: 'USD',
      date: addBusinessDays(new Date(), 2),
    }
  ]);

  // ClientID
  const [clientID, setClientID] = useState(amplifyUsername || '');
  const [clientIDMessage, setClientIDMessage] = useState('');
  const [showClientID, setShowClientID] = useState(false);

  const [executionReportMessage, setExecutionReportMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { handleClientIDCheck, handleClientIDModalClose } = useClientIDHandling(
    amplifyUsername,
    setClientID,
    setClientIDMessage,
    setShowClientID
  );
  const { handleQuoteMessage } = useQuoteHandling(setQuote);
  const { handleExecutionReport } = useDealHandling(setExecutionReport, setExecutionReportMessage, setShowExecutionReport);
  const { handleErrorMessage } = useErrorHandling(setError, setErrorMessage, setShowError);
  const { handleExecutionModalClose } = useExecutionModal(setShowExecutionReport);
  const { handleErrorModalClose } = useErrorModal(setShowError);

  const handleQuoteRequest = () =>
    prepareQuoteRequestV2({
      transactionType,
      symbol,
      clientID,
      legs,
      sendMessage,
      handleClientIDCheck,
    });

  const handleQuoteCancel = () =>
    prepareQuoteCancel({
      symbol: quote?.symbol,
      quoteRequestID: quote?.quoteRequestID,
      clientID,
      sendMessage,
    });

  const handleDealRequest = () =>
    prepareDealRequestV2({
      transactionType,
      symbol,
      clientID,
      quoteRequestID: quote?.quoteRequestID,
      quoteID: quote?.quoteID,
      legs,
      sendMessage,
    });

  const handleReset = () =>
    prepareReset({
      setQuote,
      setShowQuote,
      setExecutionReport,
      setShowExecutionReport,
      setError,
      setShowError,
      setLegs,
      setSymbol,
      setTransactionType,
    });

  return {
    transactionType,
    setTransactionType,
    symbol,
    setSymbol,
    legs,
    setLegs,
    clientID,
    setClientID,
    quote,
    showQuote,
    setShowQuote,
    executionReport,
    showExecutionReport,
    setShowExecutionReport,
    error,
    showError,
    setShowError,
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
