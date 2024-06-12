const useMessageHandling = (setConversionRateParent, setConvertedAmountParent, setShowExecutionModalParent, setExecutionModalMessageParent) => {

  const handleQuoteMessage = (quote) => {
    setConversionRateParent(quote.fxRate);
    setConvertedAmountParent(quote.amount);
  };

  const handleExecutionMessage = (report) => {
    setExecutionModalMessageParent(`Execution Report: 
      Sale price: ${report.salePrice}
      Sale currency: ${report.saleCurrency}
      Delivery date: ${report.deliveryDate}
      Currency I have: ${report.currencyIHave}
      FX Rate: ${report.fxRate}
      Amount to pay: ${report.amountToPay} ${report.currencyIHave}`);
    setShowExecutionModalParent(true);
  };

  const handleExecutionModalClose = () => {
    setShowExecutionModalParent(false);
    setExecutionModalMessageParent('');
  };

  return {
    handleQuoteMessage,
    handleExecutionMessage,
    handleExecutionModalClose,
  };
};

export default useMessageHandling;


