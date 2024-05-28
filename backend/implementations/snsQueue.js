// snsQueue.js
const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-east-1' });
const sqs = new AWS.SQS({ region: 'us-east-1' });
const MessageQueue = require('./messageQueue');

class SnsQueue extends MessageQueue {
  async sendMessage(topicArn, message) {
    const params = {
      TopicArn: topicArn,
      Message: JSON.stringify(message),
    };

    try {
      const result = await sns.publish(params).promise();
      console.log('Message sent successfully:', result);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  async receiveMessages(queueUrl, handleMessage) {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };

    try {
      const data = await sqs.receiveMessage(params).promise();
      if (data.Messages) {
        for (const message of data.Messages) {
          handleMessage(JSON.parse(message.Body));

          // Delete the message after processing
          const deleteParams = {
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          };
          await sqs.deleteMessage(deleteParams).promise();
        }
      }
    } catch (error) {
      console.error('Failed to receive messages:', error);
    }
  }
}

module.exports = SnsQueue;
