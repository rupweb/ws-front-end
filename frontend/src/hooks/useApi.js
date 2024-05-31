import axios from 'axios';

const useApi = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  const sendMessage = async (queueName, partitionKey, message) => {
    try {
      await axios.post(`${BASE_URL}/send-message`, {
        queueName,
        partitionKey,
        message,
      });
    } catch (error) {
      console.error(`Error sending message to ${queueName}:`, error);
    }
  };

  return {
    sendMessage,
  };
};

export default useApi;
