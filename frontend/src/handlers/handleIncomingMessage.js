import MessageHeaderDecoder from '../aeron/MessageHeaderDecoder.js';
import QuoteDecoder from '../aeron/v1/QuoteDecoder.js';
import ExecutionReportDecoder from '../aeron/v1/ExecutionReportDecoder.js';
import ErrorDecoder from '../aeron/v1/ErrorDecoder.js';

const handleIncomingMessage = (data, setQuote, setShowQuote, setExecutionReport, setShowExecutionReport, setError, setShowError) => {
    console.log('Incoming data: ', data);

    // Check if data is an ArrayBuffer
    if (!(data instanceof ArrayBuffer)) {
        console.error('Data is not an ArrayBuffer:', data);
        return;
    }

    let decodedData;

    try {
        const headerDecoder = new MessageHeaderDecoder();
        headerDecoder.wrap(data, 0);

        switch (headerDecoder.templateId()) {
            case 4: { // Quote
                const decoder = new QuoteDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                logData(data);

                // Decode the data
                decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    side: trimNulls(decoder.side()),
                    symbol: trimNulls(decoder.symbol()),
                    transactTime: trimNulls(decoder.transactTime()),
                    quoteID: trimNulls(decoder.quoteID()),
                    quoteRequestID: trimNulls(decoder.quoteRequestID()),
                    fxRate: decoder.decodefxRate(),
                    secondaryAmount: decoder.decodesecondaryAmount(),
                    clientID: trimNulls(decoder.clientID())
                };

                setQuote({
                    fxRate: formatDecimal(decodedData.fxRate),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount),
                    symbol: decodedData.symbol,
                    quoteRequestID: decodedData.quoteRequestID,
                    quoteID: decodedData.quoteID
                });

                console.log('setShowQuote');
                setShowQuote(true);

                break;
            }
            case 2: { // Execution Report
                const decoder = new ExecutionReportDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                logData(data);

                decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    secondaryAmount: decoder.decodesecondaryAmount(),
                    secondaryCurrency: decoder.secondaryCurrency(),
                    side: trimNulls(decoder.side()),
                    symbol: trimNulls(decoder.symbol()),
                    deliveryDate: decoder.deliveryDate(),
                    transactTime: trimNulls(decoder.transactTime()),
                    quoteRequestID: trimNulls(decoder.quoteRequestID()),
                    quoteID: trimNulls(decoder.quoteID()),
                    dealRequestID: trimNulls(decoder.dealRequestID()),
                    dealID: trimNulls(decoder.dealID()),
                    fxRate: decoder.decodefxRate(),
                    clientID: trimNulls(decoder.clientID())
                };

                setExecutionReport({
                    dealID: decodedData.dealID,
                    amount: formatDecimal(decodedData.amount),
                    currency: decodedData.currency,
                    symbol: decodedData.symbol,
                    deliveryDate: decodedData.deliveryDate,
                    secondaryCurrency: decodedData.secondaryCurrency,
                    rate: formatDecimal(decodedData.fxRate),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount)
                });

                setShowExecutionReport(true);

                break;
            }
            case 6: { // Error
                const decoder = new ErrorDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    side: trimNulls(decoder.side()),
                    symbol: trimNulls(decoder.symbol()),
                    deliveryDate: decoder.deliveryDate(),
                    transactTime: trimNulls(decoder.transactTime()),
                    quoteRequestID: trimNulls(decoder.quoteRequestID()),
                    quoteID: trimNulls(decoder.quoteID()),
                    dealRequestID: trimNulls(decoder.dealRequestID()),
                    dealID: trimNulls(decoder.dealID()),
                    fxRate: decoder.decodefxRate(),
                    secondaryAmount: decoder.decodesecondaryAmount(),
                    clientID: trimNulls(decoder.clientID()),
                    message: trimNulls(decoder.message())
                };

                setError({
                    amount: formatDecimal(decodedData.amount),
                    currency: decodedData.currency,
                    side: decodedData.side,
                    symbol: decodedData.symbol,
                    deliveryDate: decodedData.deliveryDate,
                    transactTime: decodedData.transactTime,
                    quoteRequestID: decodedData.quoteRequestID,
                    quoteID: decodedData.quoteID,
                    dealRequestID: decodedData.dealRequestID,
                    dealID: decodedData.dealID,
                    rate: formatDecimal(decodedData.fxRate),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount),
                    clientID: decodedData.clientID,
                    message: decodedData.message
                });

                setShowError(true);

                break;
            }
            default:
                console.error('Unknown message type:', headerDecoder.templateId());
                return;
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }

    console.log('Decoded Message:', decodedData);
};

export default handleIncomingMessage;

function logData(data) {
    // 🧪 LOG: check alignment after header
    const startOffset = MessageHeaderDecoder.ENCODED_LENGTH;
    const byteSlice = new Uint8Array(data, startOffset);
    const hexDump = Array.from(byteSlice).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log('🧪 Bytes after header:', hexDump);
}

function trimNulls(value) {
    return value.replace(/\0+$/, '');
}

function formatDecimal (decimal) {
    if (decimal && typeof decimal === "object" && "mantissa" in decimal && "exponent" in decimal) {
      const mantissa = typeof decimal.mantissa === "bigint" ? Number(decimal.mantissa) : decimal.mantissa;
      const exponent = typeof decimal.exponent === "bigint" ? Number(decimal.exponent) : decimal.exponent;
  
      const precision = Math.abs(exponent); // Use exponent as precision
      return (mantissa * Math.pow(10, exponent)).toFixed(precision);
    }
    return null;
}
  
