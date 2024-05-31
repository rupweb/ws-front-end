const fs = require('fs');
const path = require('path');
const MessageQueue = require('../interfaces/messageQueue');

class FileSystemQueue extends MessageQueue {
  constructor(baseDir) {
    super();
    this.baseDir = baseDir;
    this.processedDir = path.join(this.baseDir, 'processed');

    // Ensure base and processed directories exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
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
      console.log('Message written:', filePath);
    } catch (error) {
      console.error('Failed writing message:', error);
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

        // Move the file to the processed directory
        const processedFilePath = path.join(this.processedDir, file);
        await fs.promises.rename(filePath, processedFilePath);
        console.log('Message moved to processed directory:', processedFilePath);
      }
    } catch (error) {
      console.error('Failed reading messages:', error);
    }
  }
}

module.exports = FileSystemQueue;

