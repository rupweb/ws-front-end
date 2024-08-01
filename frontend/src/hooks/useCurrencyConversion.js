import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useFormValidation from './useFormValidation.js';
import useKycStatus from './useKycStatus.js';
import useConversion from './useConversion.js';
import useKycHandling from './useKycHandling.js';
import useMessageHandling from './useMessageHandling.js';
import { useWebSocket } from '../handlers/WebSocketContext.js'; 
import prepareQuoteRequest from '../handlers/handleQuoteRequest.js';
import prepareDealRequest from '../handlers/handleDealRequest.js';
import prepareReset from '../handlers/handleReset.js';

const useCurrencyConversion = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));
  const [showExecute, setShowExecute] = useState(false);

  const { kycStatus, setKycStatus } = useKycStatus();
  const { conversionRate, convertedAmount, setConversionRate, setConvertedAmount } = useConversion(fromCurrency, toCurrency, amount);
  const isFormValid = useFormValidation(fromCurrency, toCurrency, amount);

  const [kycModalMessage, setKycModalMessage] = useState('');
  const [showKycModal, setShowKycModal] = useState(false);

  const [executionModalMessage, setExecutionModalMessage] = useState('');
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  const { handleKycCheck, handleKycModalClose } = useKycHandling(
    setKycStatus,
    setKycModalMessage,
    setShowKycModal
  );

  const { handleQuoteMessage, handleExecutionMessage, handleExecutionModalClose } = useMessageHandling(
    setConversionRate,
    setConvertedAmount,
    setShowExecutionModal,
    setExecutionModalMessage
  );

  const { sendMessage } = useWebSocket();

  const handleQuoteRequest = () => prepareQuoteRequest({
    kycStatus,
    amount,
    setShowExecute,
    selectedDate,
    toCurrency,
    fromCurrency,
    sendMessage,
    handleKycCheck
  });

  const handleDealRequest = () => prepareDealRequest({
    amount,
    toCurrency,
    selectedDate,
    fromCurrency,
    conversionRate,
    convertedAmount,
    sendMessage,
    handleExecutionMessage,
    handleReset,
    kycStatus 
  });

  const handleReset = () => prepareReset({
    setFromCurrency,
    setToCurrency,
    setAmount,
    setSelectedDate,
    setShowExecute,
    setKycStatus
  });

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    conversionRate,
    convertedAmount,
    selectedDate,
    setSelectedDate,
    showExecute,
    isFormValid,
    kycStatus,
    setKycStatus,
    kycModalMessage,
    showKycModal,
    executionModalMessage,
    showExecutionModal,
    handleQuoteRequest,
    handleDealRequest,
    handleReset,
    handleKycModalClose,
    handleExecutionModalClose,
    handleQuoteMessage,
    handleExecutionMessage,
  };
};

export default useCurrencyConversion;
