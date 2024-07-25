import DealRequestEncoder from './DealRequestEncoder.js';
import MessageHeaderEncoder from './MessageHeaderEncoder.js';

const encodeDealRequest = (data) => {
    const buffer = new ArrayBuffer(DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const dealRequestEncoder = new DealRequestEncoder();
    const messageHeaderEncoder = new MessageHeaderEncoder();

    dealRequestEncoder.wrapAndApplyHeader(buffer, 0, messageHeaderEncoder);

    dealRequestEncoder.amount().mantissa(data.amount.mantissa).exponent(data.amount.exponent)
    dealRequestEncoder.currency(data.currency)
    dealRequestEncoder.side(data.side)
    dealRequestEncoder.symbol(data.symbol)
    dealRequestEncoder.deliveryDate(data.deliveryDate)
    dealRequestEncoder.transactTime(data.transactTime)
    dealRequestEncoder.quoteRequestID(data.quoteRequestID)
    dealRequestEncoder.quoteID(data.quoteID)
    dealRequestEncoder.dealRequestID(data.dealRequestID)
    dealRequestEncoder.fxRate().mantissa(data.fxRate.mantissa).exponent(data.fxRate.exponent);

    return buffer;
};

export default encodeDealRequest;

