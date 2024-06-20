class MessageQueue {
    async sendMessage(queueName, partitionKey, message) {
      throw new Error("sendMessage method not implemented");
    }
  
    async receiveMessages(queueName, handleMessage) {
      throw new Error("receiveMessages method not implemented");
    }
  }
  
  module.exports = MessageQueue;
  