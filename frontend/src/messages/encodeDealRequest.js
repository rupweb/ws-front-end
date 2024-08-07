import DealRequestEncoder from '../aeron/js/DealRequestEncoder.js'
import MessageHeaderEncoder from '../aeron/js/MessageHeaderEncoder.js'

const encodeDealRequest = (data) => {
    const buffer = new ArrayBuffer(DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH);
    const dealRequestEncoder = new DealRequestEncoder();
    const messageHeaderEncoder = new MessageHeaderEncoder();

    dealRequestEncoder.wrapAndApplyHeader(buffer, 0, messageHeaderEncoder);

    dealRequestEncoder.amountMantissa(data.amount.mantissa);
    dealRequestEncoder.amountExponent(data.amount.exponent);
    dealRequestEncoder.currency(data.currency);
    dealRequestEncoder.side(data.side);
    dealRequestEncoder.symbol(data.symbol);
    dealRequestEncoder.deliveryDate(data.deliveryDate);
    dealRequestEncoder.transactTime(data.transactTime);
    dealRequestEncoder.quoteRequestID(data.quoteRequestID);
    dealRequestEncoder.quoteID(data.quoteID);
    dealRequestEncoder.dealRequestID(data.dealRequestID);
    dealRequestEncoder.fxRateMantissa(data.fxRate.mantissa);
    dealRequestEncoder.fxRateExponent(data.fxRate.exponent);

    return buffer;
};

export default encodeDealRequest;

