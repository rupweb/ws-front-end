package backend;

import agrona.DealRequestDecoder;
import agrona.ExecutionReportDecoder;
import agrona.QuoteDecoder;
import agrona.QuoteRequestDecoder;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class WebSocketSbeDecoding extends SimpleChannelInboundHandler<WebSocketFrame> {
    private static final Logger logger = LogManager.getLogger(WebSocketSbeDecoding.class);
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        if (frame instanceof BinaryWebSocketFrame) {
            BinaryWebSocketFrame binaryFrame = (BinaryWebSocketFrame) frame;
            byte[] data = new byte[binaryFrame.content().readableBytes()];
            binaryFrame.content().readBytes(data);
            
            DirectBuffer buffer = new UnsafeBuffer(data);
            
            // Decode based on message type
            int messageType = getMessageType(buffer); // Implement getMessageType method to identify message type
            
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
    }

    private int getMessageType(DirectBuffer buffer) {
        // Implement this method to extract and return the message type from the buffer
        // This is typically done by reading the message header
        // For example:
        return buffer.getInt(0); // Placeholder implementation, assuming the message type is stored at the beginning
    }

    private void decodeDealRequest(DirectBuffer buffer) {
        DealRequestDecoder decoder = new DealRequestDecoder();
        decoder.wrap(buffer, 0, DealRequestDecoder.BLOCK_LENGTH, DealRequestDecoder.SCHEMA_VERSION);

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
        String ticketRef = decoder.ticketRef();

        mantissa = decoder.fxRate().mantissa();
        exponent = decoder.fxRate().exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        logger.info("Decoded DealRequest - Amount: {}, Currency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, TicketRef: {}, FxRate: {}",
                amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, ticketRef, fxRate);
    }

    private void decodeQuoteRequest(DirectBuffer buffer) {
        QuoteRequestDecoder decoder = new QuoteRequestDecoder();
        decoder.wrap(buffer, 0, QuoteRequestDecoder.BLOCK_LENGTH, QuoteRequestDecoder.SCHEMA_VERSION);

        long mantissa = decoder.amount().mantissa();
        byte exponent = decoder.amount().exponent();
        double salePrice = mantissa * Math.pow(10, exponent);

        String saleCurrency = decoder.saleCurrency();
        String deliveryDate = decoder.deliveryDate();
        String transactTime = decoder.transactTime();
        String quoteRequestID = decoder.quoteRequestID();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String currencyOwned = decoder.currencyOwned();

        logger.info("Decoded QuoteRequest - SalePrice: {}, SaleCurrency: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, Side: {}, Symbol: {}, CurrencyOwned: {}",
                salePrice, saleCurrency, deliveryDate, transactTime, quoteRequestID, side, symbol, currencyOwned);
    }

    private void decodeQuote(DirectBuffer buffer) {
        QuoteDecoder decoder = new QuoteDecoder();
        decoder.wrap(buffer, 0, QuoteDecoder.BLOCK_LENGTH, QuoteDecoder.SCHEMA_VERSION);

        long mantissa = decoder.amount().mantissa();
        byte exponent = decoder.amount().exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = decoder.currency();
        mantissa = decoder.fxRate().mantissa();
        exponent = decoder.fxRate().exponent();
        double fxRate = mantissa * Math.pow(10, exponent);
        String transactTime = decoder.transactTime();
        String side = decoder.side();
        String symbol = decoder.symbol();
        String quoteID = decoder.quoteID();
        String quoteRequestID = decoder.quoteRequestID();

        logger.info("Decoded Quote - Amount: {}, Currency: {}, FxRate: {}, TransactTime: {}, Side: {}, Symbol: {}, QuoteID: {}, QuoteRequestID: {}",
                amount, currency, fxRate, transactTime, side, symbol, quoteID, quoteRequestID);
    }

    private void decodeExecutionReport(DirectBuffer buffer) {
        ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(buffer, 0, ExecutionReportDecoder.BLOCK_LENGTH, ExecutionReportDecoder.SCHEMA_VERSION);

        long mantissa = decoder.amount().mantissa();
        byte exponent = decoder.amount().exponent();
        double amount = mantissa * Math.pow(10, exponent);

        String currency = decoder.currency();
        mantissa = decoder.secondaryAmount().mantissa();
        exponent = decoder.secondaryAmount().exponent();
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
        mantissa = decoder.fxRate().mantissa();
        exponent = decoder.fxRate().exponent();
        double fxRate = mantissa * Math.pow(10, exponent);

        logger.info("Decoded ExecutionReport - Amount: {}, Currency: {}, SecondaryAmount: {}, SecondaryCurrency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, DealID: {}, FxRate: {}",
                amount, currency, secondaryAmount, secondaryCurrency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, dealID, fxRate);
    }
}
