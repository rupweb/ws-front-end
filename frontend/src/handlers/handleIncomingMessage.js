import MessageHeaderDecoder from '../aeron/MessageHeaderDecoder.js';
import QuoteDecoder from '../aeron/v1/QuoteDecoder.js';
import ExecutionReportDecoder from '../aeron/v1/ExecutionReportDecoder.js';
import ErrorDecoder from '../aeron/v1/ErrorDecoder.js';
import TradeQuoteDecoder from '../aeron/v2/TradeQuoteDecoder.js';
import TradeExecutionReportDecoder from '../aeron/v2/TradeExecutionReportDecoder.js';
import TradeErrorDecoder from '../aeron/v2/TradeErrorDecoder.js';
import TradeQuoteCancelDecoder from '../aeron/v2/TradeQuoteCancelDecoder.js';
import QuoteCancelDecoder from '../aeron/v1/QuoteCancelDecoder.js';

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

        const schemaId = headerDecoder.schemaId();
        const templateId = headerDecoder.templateId();

        switch (`${schemaId}:${templateId}`) {
            case '4:2': { // Trade Quote (schema4/template2)
                const decoder = new TradeQuoteDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedData = decoder.toString();

                const firstLeg = Array.isArray(decodedData.leg) && decodedData.leg.length > 0 ? decodedData.leg[0] : null;
                const bid = firstLeg?.bid ? formatDecimal(firstLeg.bid, 5) : null;
                const offer = firstLeg?.offer ? formatDecimal(firstLeg.offer, 5) : null;

                setQuote({
                    transactionType: decodedData.transactionType,
                    symbol: decodedData.symbol,
                    quoteRequestID: decodedData.quoteRequestID,
                    quoteID: decodedData.quoteID,
                    clientID: decodedData.clientID,
                    legs: decodedData.leg,
                    fxRate: offer || bid,
                    secondaryAmount: firstLeg ? formatDecimal(firstLeg.amount) : null,
                    currency: firstLeg?.currency || ''
                });

                setShowQuote(true);
                break;
            }
            case '4:4': { // Trade Execution Report (schema4/template4)
                const decoder = new TradeExecutionReportDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedData = decoder.toString();

                const firstLeg = Array.isArray(decodedData.leg) && decodedData.leg.length > 0 ? decodedData.leg[0] : null;
                setExecutionReport({
                    dealID: decodedData.dealID,
                    amount: firstLeg?.amount ? formatDecimal(firstLeg.amount) : null,
                    currency: firstLeg?.currency || '',
                    symbol: decodedData.symbol,
                    deliveryDate: firstLeg?.valueDate || '',
                    secondaryCurrency: firstLeg?.secondaryCurrency || '',
                    rate: firstLeg?.price ? formatDecimal(firstLeg.price, 5) : null,
                    secondaryAmount: firstLeg?.secondaryAmount ? formatDecimal(firstLeg.secondaryAmount) : null
                });

                setShowExecutionReport(true);
                break;
            }
            case '4:5': { // Trade Error (schema4/template5)
                const decoder = new TradeErrorDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedData = decoder.toString();

                setError({
                    amount: null,
                    currency: '',
                    side: '',
                    symbol: decodedData.symbol,
                    deliveryDate: '',
                    transactTime: decodedData.transactTime,
                    quoteRequestID: decodedData.quoteRequestID,
                    quoteID: decodedData.quoteID,
                    dealRequestID: decodedData.dealRequestID,
                    dealID: decodedData.dealID,
                    rate: null,
                    secondaryAmount: null,
                    clientID: decodedData.clientID,
                    message: decodedData.message
                });

                setShowError(true);
                break;
            }
            case '4:6': { // Trade Quote Cancel (schema4/template6)
                const decoder = new TradeQuoteCancelDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedData = decoder.toString();
                setShowQuote(false);
                break;
            }
            case '1:4': { // Quote
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
                    fxRate: formatDecimal(decodedData.fxRate, 5),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount),
                    symbol: decodedData.symbol,
                    quoteRequestID: decodedData.quoteRequestID,
                    quoteID: decodedData.quoteID,
                    clientID: decodedData.clientID
                });

                console.log('setShowQuote');
                setShowQuote(true);

                break;
            }
            case '1:2': { // Execution Report (schema1/template2)
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
                    rate: formatDecimal(decodedData.fxRate, 5),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount)
                });

                setShowExecutionReport(true);

                break;
            }
            case '1:6': { // Error (schema1/template6)
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
                    rate: formatDecimal(decodedData.fxRate, 5),
                    secondaryAmount: formatDecimal(decodedData.secondaryAmount),
                    clientID: decodedData.clientID,
                    message: decodedData.message
                });

                setShowError(true);

                break;
            }
            case '1:5': { // QuoteCancel (schema1/template5)
                const decoder = new QuoteCancelDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);
                decodedData = {
                    symbol: trimNulls(decoder.symbol()),
                    transactTime: trimNulls(decoder.transactTime()),
                    quoteRequestID: trimNulls(decoder.quoteRequestID()),
                    clientID: trimNulls(decoder.clientID())
                };
                setShowQuote(false);
                break;
            }
            default:
                console.error('Unknown message type:', templateId);
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

function formatDecimal (decimal, maxPrecision = null) {
    if (decimal && typeof decimal === "object" && "mantissa" in decimal && "exponent" in decimal) {
      const mantissa = typeof decimal.mantissa === "bigint" ? Number(decimal.mantissa) : decimal.mantissa;
      const exponent = typeof decimal.exponent === "bigint" ? Number(decimal.exponent) : decimal.exponent;
  
      const precision = maxPrecision === null
        ? Math.abs(exponent)
        : Math.min(Math.abs(exponent), maxPrecision);
      return (mantissa * Math.pow(10, exponent)).toFixed(precision);
    }
    return null;
}
  
