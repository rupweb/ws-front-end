package backend;

import agrona.messages.DealRequestDecoder;
import agrona.messages.ExecutionReportDecoder;
import agrona.messages.QuoteDecoder;
import agrona.messages.QuoteRequestDecoder;
import agrona.messages.DecimalDecoder;
import agrona.messages.MessageHeaderDecoder;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class WebSocketSbeDecoding extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {
    private static final Logger logger = LogManager.getLogger(WebSocketSbeDecoding.class);

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        byte[] data = new byte[frame.content().readableBytes()];
        frame.content().readBytes(data);

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
        DealRequestDecoder dealRequestDecoder = new DealRequestDecoder();
        dealRequestDecoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, DealRequestDecoder.BLOCK_LENGTH, DealRequestDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, dealRequestDecoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = dealRequestDecoder.currency();
        String side = dealRequestDecoder.side();
        String symbol = dealRequestDecoder.symbol();
        String deliveryDate = dealRequestDecoder.deliveryDate();
        String transactTime = dealRequestDecoder.transactTime();
        String quoteRequestID = dealRequestDecoder.quoteRequestID();
        String quoteID = dealRequestDecoder.quoteID();
        String dealRequestID = dealRequestDecoder.dealRequestID();
        String ticketRef = dealRequestDecoder.ticketRef();

        decimalDecoder.wrap(buffer, dealRequestDecoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        logger.info("Decoded DealRequest - Amount: {}, Currency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, TicketRef: {}, FxRate: {}",
                amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, ticketRef, fxRate);
    }

    private void decodeQuoteRequest(DirectBuffer buffer) {
        QuoteRequestDecoder quoteRequestDecoder = new QuoteRequestDecoder();
        quoteRequestDecoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteRequestDecoder.BLOCK_LENGTH, QuoteRequestDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, quoteRequestDecoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double salePrice = mantissa * Math.pow(10, exponent);

        String saleCurrency = quoteRequestDecoder.saleCurrency();
        String deliveryDate = quoteRequestDecoder.deliveryDate();
        String transactTime = quoteRequestDecoder.transactTime();
        String quoteRequestID = quoteRequestDecoder.quoteRequestID();
        String side = quoteRequestDecoder.side();
        String symbol = quoteRequestDecoder.symbol();
        String currencyOwned = quoteRequestDecoder.currencyOwned();

        logger.info("Decoded QuoteRequest - SalePrice: {}, SaleCurrency: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, Side: {}, Symbol: {}, CurrencyOwned: {}",
                salePrice, saleCurrency, deliveryDate, transactTime, quoteRequestID, side, symbol, currencyOwned);
    }

    private void decodeQuote(DirectBuffer buffer) {
        QuoteDecoder quoteDecoder = new QuoteDecoder();
        quoteDecoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, quoteDecoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = quoteDecoder.currency();
        decimalDecoder.wrap(buffer, quoteDecoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);
        String transactTime = quoteDecoder.transactTime();
        String side = quoteDecoder.side();
        String symbol = quoteDecoder.symbol();
        String quoteID = quoteDecoder.quoteID();
        String quoteRequestID = quoteDecoder.quoteRequestID();

        logger.info("Decoded Quote - Amount: {}, Currency: {}, FxRate: {}, TransactTime: {}, Side: {}, Symbol: {}, QuoteID: {}, QuoteRequestID: {}",
                amount, currency, fxRate, transactTime, side, symbol, quoteID, quoteRequestID);
    }

    private void decodeExecutionReport(DirectBuffer buffer) {
        ExecutionReportDecoder executionReportDecoder = new ExecutionReportDecoder();
        executionReportDecoder.wrap(buffer, MessageHeaderDecoder.ENCODED_LENGTH, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        DecimalDecoder decimalDecoder = new DecimalDecoder();
        decimalDecoder.wrap(buffer, executionReportDecoder.amount().offset());
        long mantissa = decimalDecoder.mantissa();
        byte exponent = decimalDecoder.exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = executionReportDecoder.currency();
        decimalDecoder.wrap(buffer, executionReportDecoder.secondaryAmount().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double secondaryAmount = mantissa * Math.pow(10, exponent);
        String secondaryCurrency = executionReportDecoder.secondaryCurrency();
        String side = executionReportDecoder.side();
        String symbol = executionReportDecoder.symbol();
        String deliveryDate = executionReportDecoder.deliveryDate();
        String transactTime = executionReportDecoder.transactTime();
        String quoteRequestID = executionReportDecoder.quoteRequestID();
        String quoteID = executionReportDecoder.quoteID();
        String dealRequestID = executionReportDecoder.dealRequestID();
        String dealID = executionReportDecoder.dealID();
        decimalDecoder.wrap(buffer, executionReportDecoder.fxRate().offset());
        mantissa = decimalDecoder.mantissa();
        exponent = decimalDecoder.exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        logger.info("Decoded ExecutionReport - Amount: {}, Currency: {}, SecondaryAmount: {}, SecondaryCurrency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, DealID: {}, FxRate: {}",
                amount, currency, secondaryAmount, secondaryCurrency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, dealID, fxRate);
    }
}
