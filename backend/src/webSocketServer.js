const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log('Received message:', message.toString());
    // Handle incoming messages from clients if needed
  });

  ws.on('close', (code, reason) => {
    console.log('Client disconnected', { code, reason: reason ? reason.toString() : '' });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send a welcome message to the client
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connection established' }));
});

const broadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

module.exports = {
  broadcast,
};
