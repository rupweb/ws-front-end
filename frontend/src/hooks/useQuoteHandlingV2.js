const useQuoteMessageHandlingV2 = (setQuoteData) => {
    const handleQuoteMessage = (quoteData) => {
      setQuoteData(quoteData);
    };
  
    return {
      handleQuoteMessage
    };
  };
  
  export default useQuoteMessageHandlingV2;
  