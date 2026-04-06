jest.mock('../../src/messages/encodeQuoteRequestV2.js', () => jest.fn(() => 'encoded-buffer'));
jest.mock('../../src/utils/utils.js', () => {
  const actual = jest.requireActual('../../src/utils/utils.js');
  return {
    ...actual,
    generateUUID: () => 'QUOTE12345678'
  };
});

import handleQuoteRequestV2 from '../../src/handlers/handleQuoteRequestV2.js';
import encodeQuoteRequest from '../../src/messages/encodeQuoteRequestV2.js';

describe('handleQuoteRequestV2 timestamps', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-06T13:49:08.723Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('encodes transactTime in UTC to match messageTime', async () => {
    const sendMessage = jest.fn();
    const handleClientIDCheck = jest.fn(() => false);

    await handleQuoteRequestV2({
      transactionType: 'SPO',
      symbol: 'EURUSD',
      clientID: 'test',
      legs: [
        {
          amount: '1000',
          currency: 'USD',
          side: 'BUY',
          date: '2026-04-08'
        }
      ],
      sendMessage,
      handleClientIDCheck
    });

    expect(encodeQuoteRequest).toHaveBeenCalledTimes(1);
    const payload = encodeQuoteRequest.mock.calls[0][0];

    expect(payload.transactTime).toBe('20260406-13:49:08.723');
    expect(payload.messageTime).toBe(BigInt(Date.parse('2026-04-06T13:49:08.723Z')));
    expect(sendMessage).toHaveBeenCalledWith('encoded-buffer');
  });
});
