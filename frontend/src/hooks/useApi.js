import axios from 'axios';

const useApi = () => {
  const sendMessage = async (queueName, partitionKey, message) => {
    try {
      await axios.post('http://localhost:3001/send-message', {
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
