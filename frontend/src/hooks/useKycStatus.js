import { useState, useEffect, useRef } from 'react';

const useKycStatus = (initialStatus = 'Not Started') => {
  const [kycStatus, setKycStatus] = useState(initialStatus);
  const prevKycStatusRef = useRef(initialStatus);
  
  useEffect(() => {
    prevKycStatusRef.current = kycStatus;
  }, [kycStatus]);
  
  return {
    kycStatus,
    setKycStatus,
    prevKycStatus: prevKycStatusRef.current
  };
};

export default useKycStatus;
