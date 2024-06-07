import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { useAuthenticator } from '@aws-amplify/ui-react';

const useApi = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  const sendMessage = async (detailType, detail) => {
    try {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      const credentials = await user.getAWSCredentials(); // Assuming the useAuthenticator hook provides this method
      const client = new EventBridgeClient({
        region: 'eu-west-2',
        credentials,
      });

      const params = {
        Entries: [
          {
            Source: 'fxapi.webstersystems.co.uk',
            DetailType: detailType,
            Detail: JSON.stringify(detail),
            EventBusName: 'default',
          },
        ],
      };

      const command = new PutEventsCommand(params);
      await client.send(command);
      console.log(`Event sent: ${detailType}`);
    } catch (error) {
      console.error(`Error sending event ${detailType}:`, error);
    }
  };

  return {
    sendMessage,
  };
};

export default useApi;

