import { useEffect } from 'react';
import axios from 'axios';

const usePollMessages = (queueName, handleMessage) => {
  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

    const pollMessages = async () => {
      while (true) {
        try {
          const response = await axios.get(`${BASE_URL}/receive-messages/${queueName}`);
          response.data.forEach(handleMessage);
        } catch (error) {
          console.error(`Error fetching ${queueName} messages:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }
    };

    pollMessages();
  }, [queueName, handleMessage]);
};

export default usePollMessages;
