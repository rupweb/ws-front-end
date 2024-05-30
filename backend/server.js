const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const FileSystemQueue = require('./implementations/fileSystemQueue');

const app = express();
const port = 3001;

const messageQueue = new FileSystemQueue('./messages');

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

app.post('/send-message', async (req, res) => {
  const { queueName, partitionKey, message } = req.body;
  await messageQueue.sendMessage(queueName, partitionKey, message);
  res.sendStatus(200);
});

app.get('/receive-messages/:queueName', async (req, res) => {
  const { queueName } = req.params;
  const messages = [];
  await messageQueue.receiveMessages(queueName, (message) => {
    messages.push(message);
  });
  res.json(messages);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

