import { useState } from 'react';
import { addBusinessDays } from '../utils/utils.js';
import useFormValidation from './useFormValidation.js';
import useKycStatus from './useKycStatus.js';
import useConversion from './useConversion.js';
import useKycHandling from './useKycHandling.js';
import useMessageHandling from './useMessageHandling.js';
import { useWebSocket } from '../handlers/WebSocketContext.js'; 
import handleQuoteRequest from '../handlers/handleQuoteRequest.js';
import handleDealRequest from '../handlers/handleDealRequest.js';
import handleReset from '../handlers/handleReset.js';

const useCurrencyConversion = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));
  const [showExecute, setShowExecute] = useState(false);

  const { kycStatus, setKycStatus } = useKycStatus();
  const { conversionRate, convertedAmount, convert, setConversionRate, setConvertedAmount } = useConversion(fromCurrency, toCurrency, amount);
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

  const handleConvertFunction = () => handleQuoteRequest({
    kycStatus,
    amount,
    convert,
    setShowExecute,
    selectedDate,
    toCurrency,
    fromCurrency,
    sendMessage,
    handleKycCheck
  });

  const handleExecuteFunction = () => handleDealRequest({
    amount,
    toCurrency,
    selectedDate,
    fromCurrency,
    conversionRate,
    convertedAmount,
    sendMessage,
    handleExecutionMessage,
    handleReset: handleResetFunction,
    kycStatus 
  });

  const handleResetFunction = () => handleReset({
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
    handleConvert: handleConvertFunction,
    handleExecute: handleExecuteFunction,
    handleReset: handleResetFunction,
    handleKycModalClose,
    handleExecutionModalClose,
    handleQuoteMessage,
    handleExecutionMessage,
  };
};

export default useCurrencyConversion;
