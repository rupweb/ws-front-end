const fs = require('fs');
const path = require('path');
const MessageQueue = require('../interfaces/messageQueue');

class FileSystemQueue extends MessageQueue {
  constructor(baseDir) {
    super();
    this.baseDir = baseDir;
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
  }

  async sendMessage(queueName, partitionKey, message) {
    const queueDir = path.join(this.baseDir, queueName);
    if (!fs.existsSync(queueDir)) {
      fs.mkdirSync(queueDir, { recursive: true });
    }

    const fileName = `${partitionKey}-${Date.now()}.json`;
    const filePath = path.join(queueDir, fileName);

    try {
      await fs.promises.writeFile(filePath, JSON.stringify(message));
      console.log('Message written successfully:', filePath);
    } catch (error) {
      console.error('Failed to write message:', error);
    }
  }

  async receiveMessages(queueName, handleMessage) {
    const queueDir = path.join(this.baseDir, queueName);
    if (!fs.existsSync(queueDir)) {
      console.error('Queue directory does not exist:', queueDir);
      return;
    }

    try {
      const files = await fs.promises.readdir(queueDir);
      for (const file of files) {
        const filePath = path.join(queueDir, file);
        const data = await fs.promises.readFile(filePath, 'utf-8');
        handleMessage(JSON.parse(data));
        await fs.promises.unlink(filePath); // Delete the file after processing
      }
    } catch (error) {
      console.error('Failed to read messages:', error);
    }
  }
}

module.exports = FileSystemQueue;

