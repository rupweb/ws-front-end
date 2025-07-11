const useDealMessageHandlingV2 = (setDealData) => {
  const handleDealMessage = (dealData) => {
    setDealData(dealData);
  };

  return {
    handleDealMessage
  };
};

export default useDealMessageHandlingV2;
