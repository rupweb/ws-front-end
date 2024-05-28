// kinesisQueue.js
const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis({ region: 'us-east-1' });
const kinesisReadable = require('kinesis-readable');
const MessageQueue = require('./messageQueue');

class KinesisQueue extends MessageQueue {
  async sendMessage(streamName, partitionKey, message) {
    const params = {
      StreamName: streamName,
      PartitionKey: partitionKey,
      Data: JSON.stringify(message),
    };

    try {
      const result = await kinesis.putRecord(params).promise();
      console.log('Record put successfully:', result);
    } catch (error) {
      console.error('Failed to put record:', error);
    }
  }

  async receiveMessages(streamName, handleMessage) {
    const reader = kinesisReadable(kinesis, streamName, {
      limit: 10,
      highWaterMark: 10,
    });

    reader.on('data', (records) => {
      records.forEach((record) => {
        const data = JSON.parse(record.Data.toString());
        handleMessage(data);
      });
    });

    reader.on('error', (error) => {
      console.error('Error consuming records:', error);
    });

    reader.on('end', () => {
      console.log('Finished consuming records');
    });
  }
}

module.exports = KinesisQueue;
