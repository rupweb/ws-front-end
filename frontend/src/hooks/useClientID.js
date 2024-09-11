import { useState, useEffect, useRef } from 'react';

const useClientID = (initialStatus = '') => {
  const [clientID, setClientID] = useState(initialStatus);
  const prevClientIDRef = useRef(initialStatus);
  
  useEffect(() => {
    prevClientIDRef.current = clientID;
  }, [clientID]);
  
  return {
    clientID,
    setClientID,
    prevClientID: prevClientIDRef.current
  };
};

export default useClientID;
