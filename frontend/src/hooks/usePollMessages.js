import { useEffect } from 'react';
import axios from 'axios';

const usePollMessages = (eventType, handleMessage) => {
  useEffect(() => {
    const BASE_URL = 'https://fxapi.webstersystems.co.uk';

    const pollMessages = async () => {
      while (true) {
        try {
          const response = await axios.get(`${BASE_URL}/events/${eventType}`);
          response.data.forEach(handleMessage);
        } catch (error) {
          console.error(`Error fetching ${eventType} events:`, error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }
    };

    pollMessages();
  }, [eventType, handleMessage]);
};

export default usePollMessages;
