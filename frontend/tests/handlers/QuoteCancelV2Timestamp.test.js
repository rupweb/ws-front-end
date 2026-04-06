jest.mock('../../src/messages/encodeQuoteCancelV2.js', () => jest.fn(() => 'encoded-buffer'));

import handleQuoteCancelV2 from '../../src/handlers/handleQuoteCancelV2.js';
import encodeQuoteCancelV2 from '../../src/messages/encodeQuoteCancelV2.js';

describe('handleQuoteCancelV2 timestamps', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-06T13:49:08.723Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('encodes cancel transactTime in UTC to stay aligned with messageTime', async () => {
    const sendMessage = jest.fn();

    await handleQuoteCancelV2({
      transactionType: 'SPO',
      symbol: 'EURUSD',
      quoteRequestID: 'CT3SWANNRMPF',
      clientID: 'test',
      sendMessage
    });

    expect(encodeQuoteCancelV2).toHaveBeenCalledTimes(1);
    const payload = encodeQuoteCancelV2.mock.calls[0][0];

    expect(payload.transactionType).toBe('SPO');
    expect(payload.transactTime).toBe('20260406-13:49:08.723');
    expect(payload.messageTime).toBe(BigInt(Date.parse('2026-04-06T13:49:08.723Z')));
    expect(sendMessage).toHaveBeenCalledWith('encoded-buffer');
  });
});
