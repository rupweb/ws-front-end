import { useState } from 'react';
import { addBusinessDays, generateUUID } from '../utils/utils';
import usePollMessages from './usePollMessages';
import useApi from './useApi';
import useFormValidation from './useFormValidation';
import useKycStatus from './useKycStatus';
import useConversion from './useConversion';

const useCurrencyConversion = () => {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(addBusinessDays(new Date(), 2));
  const [showExecute, setShowExecute] = useState(false);
  const [kycModalMessage, setKycModalMessage] = useState('');
  const [showKycModal, setShowKycModal] = useState(false);
  const [executionModalMessage, setExecutionModalMessage] = useState('');
  const [showExecutionModal, setShowExecutionModal] = useState(false);

  const { kycStatus, setKycStatus } = useKycStatus();
  const { conversionRate, convertedAmount, convert, setConversionRate, setConvertedAmount } = useConversion(fromCurrency, toCurrency, amount);
  const isFormValid = useFormValidation(fromCurrency, toCurrency, amount);
  const { sendMessage } = useApi();

  usePollMessages('quote', (quote) => {
    setConversionRate(quote.fxRate);
    setConvertedAmount(quote.amount);
  });

  usePollMessages('executionReport', (report) => {
    setExecutionModalMessage(`Execution Report: 
      Sale price: ${report.salePrice}
      Sale currency: ${report.saleCurrency}
      Delivery date: ${report.deliveryDate}
      Currency I have: ${report.currencyIHave}
      FX Rate: ${report.fxRate}
      Amount to pay: ${report.amountToPay} ${report.currencyIHave}`);
    setShowExecutionModal(true);
  });

  const handleConvert = async () => {
    if (kycStatus === 'Not Started' || kycStatus === 'Pending') {
      setKycModalMessage('Please complete the Dotmed KYC form.');
      setShowKycModal(true);
      return;
    }

    if (kycStatus !== 'Verified') {
      setKycModalMessage('KYC check in process');
      setShowKycModal(true);

      setTimeout(() => {
        setKycModalMessage('KYC unverified');
        setShowKycModal(true);
      }, 2000);
      return;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    convert();
    setShowExecute(true);

    const quoteRequest = {
      salePrice: amount,
      saleCurrency: toCurrency,
      deliveryDate: selectedDate.toISOString().split('T')[0],
      transactTime: new Date().toISOString(),
      quoteRequestID: generateUUID(),
      side: 'BUY',
      symbol: `${fromCurrency}/${toCurrency}`,
      currencyOwned: fromCurrency,
      kycStatus,
    };

    await sendMessage('quoteRequest', quoteRequest);
  };

  const handleExecute = async () => {
    const execution = {
      date: new Date().toLocaleDateString(),
      salePrice: amount,
      saleCurrency: toCurrency,
      deliveryDate: selectedDate.toLocaleDateString(),
      currencyIHave: fromCurrency,
      fxRate: conversionRate,
      amountToPay: convertedAmount.toFixed(2),
    };

    const executions = JSON.parse(localStorage.getItem('executions')) || [];
    executions.push(execution);
    localStorage.setItem('executions', JSON.stringify(executions));

    const dealRequest = {
      salePrice: amount,
      saleCurrency: toCurrency,
      deliveryDate: selectedDate.toISOString().split('T')[0],
      transactTime: new Date().toISOString(),
      quoteRequestID: generateUUID(),
      side: 'BUY',
      symbol: `${fromCurrency}/${toCurrency}`,
      currencyOwned: fromCurrency,
      kycStatus,
    };

    await sendMessage('dealRequest', dealRequest);

    setExecutionModalMessage(`Execution Report: 
      Sale price: ${amount}
      Sale currency: ${toCurrency}
      Delivery date: ${selectedDate.toLocaleDateString()}
      Currency I have: ${fromCurrency}
      FX Rate: ${conversionRate}
      Amount to pay: ${convertedAmount.toFixed(2)} ${fromCurrency}`);
    setShowExecutionModal(true);
    handleReset();
  };

  const handleReset = () => {
    setFromCurrency('EUR');
    setToCurrency('USD');
    setAmount('');
    setSelectedDate(addBusinessDays(new Date(), 2));
    setShowExecute(false);
    setKycStatus('Not Started');
  };

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
    handleConvert,
    handleExecute,
    handleReset,
    handleKycModalClose: () => setShowKycModal(false),
    handleExecutionModalClose: () => setShowExecutionModal(false),
  };
};

export default useCurrencyConversion;
