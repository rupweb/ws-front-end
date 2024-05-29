// kafkaQueue.js
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const MessageQueue = require('./messageQueue');

class KafkaQueue extends MessageQueue {
  constructor() {
    super();
    this.producer = new Producer(client);
  }

  async sendMessage(topic, partitionKey, message) {
    const payloads = [
      { topic, messages: JSON.stringify(message) },
    ];

    this.producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Failed to send message:', err);
      } else {
        console.log('Message sent successfully:', data);
      }
    });
  }

  async receiveMessages(topic, handleMessage) {
    const consumer = new Consumer(client, [{ topic, partition: 0 }], { autoCommit: true });

    consumer.on('message', (message) => {
      handleMessage(JSON.parse(message.value));
    });

    consumer.on('error', (err) => {
      console.error('Failed to consume message:', err);
    });
  }
}

module.exports = KafkaQueue;
