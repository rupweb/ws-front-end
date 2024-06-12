const aeron = require('aeron-client');
const { broadcast } = require('./webSocketServer');

const channel = 'aeron:udp?endpoint=localhost:40123';
const streamId = 10;

const ctx = new aeron.Aeron.Context();
const subscription = aeron.Aeron.connect(ctx).addSubscription(channel, streamId);

const fragmentHandler = (buffer, offset, length, header) => {
  const message = buffer.getStringWithoutLengthUtf8(offset, length);
  broadcast(message);
};

const pollAeron = () => {
  while (true) {
    subscription.poll(fragmentHandler, 10);
  }
};

pollAeron();
