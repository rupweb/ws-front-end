const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let events = [];

app.post('/event', (req, res) => {
  const event = req.body;
  events.push(event);
  res.status(200).send('Event received');
});

app.get('/events/:eventType', (req, res) => {
  const { eventType } = req.params;
  const filteredEvents = events.filter(event => event.detailType === eventType);
  res.status(200).json(filteredEvents);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

