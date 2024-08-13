import MessageHeaderDecoder from '../aeron/js/MessageHeaderDecoder.js';
import QuoteDecoder from '../aeron/js/QuoteDecoder.js';
import ExecutionReportDecoder from '../aeron/js/ExecutionReportDecoder.js';
import ErrorDecoder from '../aeron/js/ErrorDecoder.js';

const handleIncomingMessage = (data, setQuoteData) => {
    console.log('Incoming data: ', data);

    // Check if data is an ArrayBuffer
    if (!(data instanceof ArrayBuffer)) {
        console.error('Data is not an ArrayBuffer:', data);
        return;
    }

    let decodedMessage;

    try {
        const headerDecoder = new MessageHeaderDecoder();

        // Wrap the header to read it
        headerDecoder.wrap(data, 0);

        switch (headerDecoder.templateId()) {
            case 4: { // Quote
                const decoder = new QuoteDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                // Decode the data
                const decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    side: decoder.side().replace(/\0/g, ''),
                    symbol: decoder.symbol(),
                    transactTime: decoder.transactTime(),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    fxRate: decoder.decodefxRate(),
                    secondaryAmount: decoder.decodesecondaryAmount()
                };

                const fxRate = decodedData.fxRate.mantissa * Math.pow(10, decodedData.fxRate.exponent);
                const secondaryAmount = decodedData.secondaryAmount.mantissa * Math.pow(10, decodedData.secondaryAmount.exponent);

                setQuoteData({
                    conversionRate: fxRate,
                    fromCurrency: getFromCcy(decodedData.currency, decodedData.symbol),
                    convertedAmount: secondaryAmount,
                });

                break;
            }
            case 2: { // Execution Report
                const decoder = new ExecutionReportDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                const decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    secondaryAmount: decoder.decodesecondaryAmount(),
                    secondaryCurrency: decoder.secondaryCurrency(),
                    side: decoder.side().replace(/\0/g, ''),
                    symbol: decoder.symbol(),
                    deliveryDate: decoder.deliveryDate(),
                    transactTime: decoder.transactTime(),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
                    dealID: decoder.dealID().replace(/\0/g, ''),
                    fxRate: decoder.decodefxRate()
                };

                console.log(decodedData);

                break;
            }
            case 5: { // Error
                const decoder = new ErrorDecoder();
                decoder.wrap(data, MessageHeaderDecoder.ENCODED_LENGTH);

                const decodedData = {
                    amount: decoder.decodeamount(),
                    currency: decoder.currency(),
                    side: decoder.side().replace(/\0/g, ''),
                    symbol: decoder.symbol(),
                    deliveryDate: decoder.deliveryDate(),
                    transactTime: decoder.transactTime(),
                    quoteRequestID: decoder.quoteRequestID().replace(/\0/g, ''),
                    quoteID: decoder.quoteID().replace(/\0/g, ''),
                    dealRequestID: decoder.dealRequestID().replace(/\0/g, ''),
                    dealID: decoder.dealID().replace(/\0/g, ''),
                    fxRate: decoder.decodefxRate(),
                    message: decoder.message().replace(/\0/g, '')
                };

                console.log(decodedData);

                break;
            }
            default:
                console.error('Unknown message type:', headerDecoder.templateId());
                return;
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }

    console.log('Decoded Message:', decodedMessage);
};

const getFromCcy = (currency, symbol) => {
    const firstCurrency = symbol.substring(0, 3);
    const secondCurrency = symbol.substring(3, 6);
    return firstCurrency === currency ? secondCurrency : firstCurrency;
};

export default handleIncomingMessage;
