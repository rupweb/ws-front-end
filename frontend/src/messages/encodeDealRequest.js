import DealRequestEncoder from '../aeron/js/DealRequestEncoder.js'
import MessageHeaderEncoder from '../aeron/js/MessageHeaderEncoder.js'

const encodeDealRequest = (data) => {
    const buffer = new ArrayBuffer(DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const headerEncoder = new MessageHeaderEncoder();
    const encoder = new DealRequestEncoder();

    // Encode the data
    encoder.wrapAndApplyHeader(buffer, 0, headerEncoder);
    encoder.encodeamount(data.amount);
    encoder.currency(data.currency);
    encoder.side(data.side);
    encoder.symbol(data.symbol);
    encoder.deliveryDate(data.deliveryDate);
    encoder.transactTime(data.transactTime);
    encoder.quoteRequestID(data.quoteRequestID);
    encoder.quoteID(data.quoteID);
    encoder.dealRequestID(data.dealRequestID);
    encoder.encodefxRate(data.fxRate);
    encoder.encodesecondaryAmount(data.secondaryAmount);
    encoder.clientID(data.clientID);

    return buffer;
};

export default encodeDealRequest;

