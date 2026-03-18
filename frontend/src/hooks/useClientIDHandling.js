const useClientIDHandling = (amplifyUsername, clientID, setClientIDModalMessageParent, setShowClientIDModalParent) => {
  const handleClientIDCheck = (clientID, amount) => {
    const resolvedClientID = (clientID || '').trim();
    console.log('Hook amplifyUsername:', amplifyUsername);
    console.log('Hook clientID:', resolvedClientID);

    if (!resolvedClientID) {
      setClientIDModalMessageParent('Client ID is not available yet. Please wait a moment and retry.');
      setShowClientIDModalParent(true);
      return true;
    }

    if (resolvedClientID === amplifyUsername) {
      return false;
    }

    if (resolvedClientID === 'Other') {
      setClientIDModalMessageParent('Please complete the Client Onboarding form.');
      setShowClientIDModalParent(true);
      return true;
    }

    if (resolvedClientID === 'TEST') {
      setClientIDModalMessageParent('ClientID check in process');
      setShowClientIDModalParent(true);

      setTimeout(() => {
        setClientIDModalMessageParent('ClientID unverified');
        setShowClientIDModalParent(true);
      }, 2000);
      return true;
    }

    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return true;
    }

    return false;
  };

  const handleClientIDModalClose = () => {
    setShowClientIDModalParent(false);
  };

  return {
    handleClientIDCheck,
    handleClientIDModalClose,
  };
};

export default useClientIDHandling;

