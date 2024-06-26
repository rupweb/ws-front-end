/* eslint-disable no-undef */
// Import necessary Java classes using GraalVM's Polyglot API
const Java = Polyglot.import('java');

// Import the SBE decoder classes
const ExecutionReportDecoder = Java.type('agrona.ExecutionReportDecoder');
const MessageHeaderDecoder = Java.type('agrona.MessageHeaderDecoder');
const UnsafeBuffer = Java.type('org.agrona.concurrent.UnsafeBuffer');
/* eslint-enable no-undef */

// Function to decode an ExecutionReport message
function decodeExecutionReport(encodedMessage) {
    const buffer = new UnsafeBuffer(encodedMessage);
    const headerDecoder = new MessageHeaderDecoder();
    const decoder = new ExecutionReportDecoder();

    headerDecoder.wrap(buffer, 0);
    decoder.wrapAndApplyHeader(buffer, 0, headerDecoder);

    const result = {
        amount: {
            mantissa: decoder.amount().mantissa(),
            exponent: decoder.amount().exponent()
        },
        currency: Java.toJSArray(decoder.currency()).map(byte => String.fromCharCode(byte)).join(''),
        secondaryAmount: {
            mantissa: decoder.secondaryAmount().mantissa(),
            exponent: decoder.secondaryAmount().exponent()
        },
        secondaryCurrency: Java.toJSArray(decoder.secondaryCurrency()).map(byte => String.fromCharCode(byte)).join(''),
        side: Java.toJSArray(decoder.side()).map(byte => String.fromCharCode(byte)).join(''),
        symbol: Java.toJSArray(decoder.symbol()).map(byte => String.fromCharCode(byte)).join(''),
        deliveryDate: Java.toJSArray(decoder.deliveryDate()).map(byte => String.fromCharCode(byte)).join(''),
        transactTime: Java.toJSArray(decoder.transactTime()).map(byte => String.fromCharCode(byte)).join(''),
        quoteRequestID: Java.toJSArray(decoder.quoteRequestID()).map(byte => String.fromCharCode(byte)).join(''),
        quoteID: Java.toJSArray(decoder.quoteID()).map(byte => String.fromCharCode(byte)).join(''),
        dealRequestID: Java.toJSArray(decoder.dealRequestID()).map(byte => String.fromCharCode(byte)).join(''),
        dealID: Java.toJSArray(decoder.dealID()).map(byte => String.fromCharCode(byte)).join(''),
        fxRate: {
            mantissa: decoder.fxRate().mantissa(),
            exponent: decoder.fxRate().exponent()
        }
    };

    return result;
}

// Expose the function to JavaScript
/* eslint-disable no-undef */
Polyglot.export('decodeExecutionReport', decodeExecutionReport);
/* eslint-enable no-undef */
