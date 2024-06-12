const useKycHandling = (kycStatus, setKycModalMessageParent, setShowKycModalParent) => {

  const handleKycCheck = (kycStatus, amount) => {
    if (kycStatus === 'Not Started' || kycStatus === 'Pending') {
      setKycModalMessageParent('Please complete the Dotmed KYC form.');
      setShowKycModalParent(true);
      return true;
    }

    if (kycStatus !== 'Verified') {
      setKycModalMessageParent('KYC check in process');
      setShowKycModalParent(true);

      setTimeout(() => {
        setKycModalMessageParent('KYC unverified');
        setShowKycModalParent(true);
      }, 2000);
      return true;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return true;
    }

    return false;
  };

  const handleKycModalClose = () => {
    setShowKycModalParent(false);
  };

  return {
    handleKycCheck,
    handleKycModalClose,
  };
};

export default useKycHandling;
