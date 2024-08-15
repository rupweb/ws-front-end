package messaging;

import agrona.messages.DealRequestDecoder;
import agrona.messages.ExecutionReportDecoder;
import agrona.messages.KycStatus;
import agrona.messages.QuoteDecoder;
import agrona.messages.QuoteRequestDecoder;
import agrona.messages.ErrorDecoder;
import agrona.messages.DecimalDecoder;
import agrona.messages.MessageHeaderDecoder;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class SbeDecoder {
    private static final Logger logger = LogManager.getLogger(SbeDecoder.class);

    public void decode(byte[] data) {
        DirectBuffer buffer = new UnsafeBuffer(data);

        // Decode based on message type
        int messageType = getMessageType(buffer);

        switch (messageType) {
            case DealRequestDecoder.TEMPLATE_ID:
                decodeDealRequest(buffer);
                break;
            case QuoteRequestDecoder.TEMPLATE_ID:
                decodeQuoteRequest(buffer);
                break;
            case QuoteDecoder.TEMPLATE_ID:
                decodeQuote(buffer);
                break;
            case ExecutionReportDecoder.TEMPLATE_ID:
                decodeExecutionReport(buffer);
                break;
            case ErrorDecoder.TEMPLATE_ID:
                decodeError(buffer);
                break;
            default:
                logger.error("Unknown message type: {}", messageType);
        }
    }

    private int getMessageType(DirectBuffer buffer) {
        // The offset for the template ID in the SBE message header
        final int templateIdOffset = 2;
        // Read the template ID (message type) from the buffer
        return buffer.getShort(templateIdOffset, java.nio.ByteOrder.LITTLE_ENDIAN);
    }

    private void decodeDealRequest(DirectBuffer buffer) {
        DealRequestDecoder decoder = new DealRequestDecoder();
        decoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, DealRequestDecoder.BLOCK_LENGTH, DealRequestDecoder.SCHEMA_VERSION);

        long mantissa = decoder.amount().mantissa();
        byte exponent = decoder.amount().exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = decoder.currency();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String deliveryDate = decoder.deliveryDate();
        String transactTime = decoder.transactTime();
        String quoteRequestID = decoder.quoteRequestID();
        String quoteID = decoder.quoteID();
        String dealRequestID = decoder.dealRequestID();

        long fxMantissa = decoder.fxRate().mantissa();
        byte fxExponent = decoder.fxRate().exponent();
        double fxRate = fxMantissa * Math.pow(10, fxExponent);

        // Decode Secondary Amount
        long saMantissa = decoder.secondaryAmount().mantissa();
        byte saExponent = decoder.secondaryAmount().exponent();
        double secondaryAmount = saMantissa * Math.pow(10, saExponent);

        logger.info("Amount: {}, Currency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, FxRate: {}, SecondaryAmount: {}",
                amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, fxRate, secondaryAmount);
    }

    private void decodeQuoteRequest(DirectBuffer buffer) {
        QuoteRequestDecoder decoder = new QuoteRequestDecoder();
        decoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteRequestDecoder.BLOCK_LENGTH, QuoteRequestDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, decoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double salePrice = mantissa * Math.pow(10, exponent);
        String saleCurrency = decoder.saleCurrency();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String deliveryDate = decoder.deliveryDate();
        String transactTime = decoder.transactTime();
        String quoteRequestID = decoder.quoteRequestID();
        String currencyOwned = decoder.currencyOwned();
        KycStatus kycStatus = decoder.kycStatus();
        
        logger.info("SalePrice: {}, SaleCurrency: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, Side: {}, Symbol: {}, CurrencyOwned: {}, KycStatus: {}",
                salePrice, saleCurrency, deliveryDate, transactTime, quoteRequestID, side, symbol, currencyOwned, kycStatus);
    }

    private void decodeQuote(DirectBuffer buffer) {
        QuoteDecoder decoder = new QuoteDecoder();
        decoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();

        // Decode Amount
        decimalDecoder.wrap(buffer, decoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        // Decode Currency
        String currency = decoder.currency();

        String side = decoder.side();
        String symbol = decoder.symbol();
        String transactTime = decoder.transactTime();
        String quoteID = decoder.quoteID();
        String quoteRequestID = decoder.quoteRequestID();

        // Decode FX Rate
        decimalDecoder.wrap(buffer, decoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        // Decode Secondary Amount
        decimalDecoder.wrap(buffer, decoder.secondaryAmount().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double secondaryAmount = mantissa * Math.pow(10, exponent);

        logger.info("Amount: {}, Currency: {}, Side: {}, Symbol: {}, TransactTime: {}, QuoteID: {}, QuoteRequestID: {}, FxRate: {}, SecondaryAmount: {}",
                amount, currency, side, symbol, transactTime, quoteID, quoteRequestID, fxRate, secondaryAmount);
    }

    private void decodeExecutionReport(DirectBuffer buffer) {
        ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, decoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = decoder.currency();

        decimalDecoder.wrap(buffer, decoder.secondaryAmount().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double secondaryAmount = mantissa * Math.pow(10, exponent);

        String secondaryCurrency = decoder.secondaryCurrency();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String deliveryDate = decoder.deliveryDate();
        String transactTime = decoder.transactTime();
        String quoteRequestID = decoder.quoteRequestID();
        String quoteID = decoder.quoteID();
        String dealRequestID = decoder.dealRequestID();
        String dealID = decoder.dealID();

        decimalDecoder.wrap(buffer, decoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        logger.info("Amount: {}, Currency: {}, SecondaryAmount: {}, SecondaryCurrency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, DealID: {}, FxRate: {}",
                amount, currency, secondaryAmount, secondaryCurrency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, dealID, fxRate);
    }

    private void decodeError(DirectBuffer buffer) {
        ErrorDecoder decoder = new ErrorDecoder();
        decoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, ErrorDecoder.BLOCK_LENGTH, ErrorDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, decoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = decoder.currency();

        decimalDecoder.wrap(buffer, decoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        String transactTime = decoder.transactTime();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String deliveryDate = decoder.deliveryDate();
        String quoteRequestID = decoder.quoteRequestID();
        String quoteID = decoder.quoteID();
        String dealRequestID = decoder.dealRequestID();
        String dealID = decoder.dealID();

        // Decode Secondary Amount
        decimalDecoder.wrap(buffer, decoder.secondaryAmount().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double secondaryAmount = mantissa * Math.pow(10, exponent);

        String message = decoder.message();

        logger.info("Amount: {}, Currency: {}, FxRate: {}, TransactTime: {}, Side: {}, Symbol: {}, DeliveryDate: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, DealID: {}, SecondaryAmount: {}, Message: {}",
                amount, currency, fxRate, transactTime, side, symbol, deliveryDate, quoteRequestID, quoteID, dealRequestID, dealID, secondaryAmount, message);
    }
}
