package backend;

import agrona.messages.DealRequestEncoder;
import agrona.messages.ExecutionReportEncoder;
import agrona.messages.QuoteEncoder;
import agrona.messages.QuoteRequestEncoder;
import agrona.messages.DecimalEncoder;
import agrona.messages.MessageHeaderEncoder;
import org.agrona.concurrent.UnsafeBuffer;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class WebSocketSbeEncoding {
    private static final Logger logger = LogManager.getLogger(WebSocketSbeEncoding.class);

    public static byte[] encodeDealRequest(double amount, String currency, String side, String symbol, 
                                           String deliveryDate, String transactTime, String quoteRequestID, 
                                           String quoteID, String dealRequestID, String ticketRef, double fxRate) {

        DealRequestEncoder encoder = new DealRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa((long) (amount * 10000)).exponent((byte) -4);
        
        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);
        encoder.ticketRef(ticketRef);
        
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa((long) (fxRate * 10000)).exponent((byte) -4);

        byte[] encodedData = new byte[encoder.encodedLength()];
        buffer.getBytes(0, encodedData);
        return encodedData;
    }

    public static byte[] encodeQuoteRequest(double amount, String saleCurrency, String side, String symbol, 
                                   String deliveryDate, String transactTime, String quoteRequestID, String currencyOwned) {
        QuoteRequestEncoder encoder = new QuoteRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);
        
        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa((long) (amount * 10000)).exponent((byte) -4);
        
        encoder.saleCurrency(saleCurrency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.currencyOwned(currencyOwned);
        
        byte[] encodedData = new byte[encoder.encodedLength()];
        buffer.getBytes(0, encodedData);
        return encodedData;
    }

    public static byte[] encodeQuote(double amount, String currency, String side, String symbol, 
                            String transactTime, String quoteRequestID, String quoteID, double fxRate) {
        QuoteEncoder encoder = new QuoteEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);
        
        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa((long) (amount * 10000)).exponent((byte) -4);
        
        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa((long) (fxRate * 10000)).exponent((byte) -4);

        byte[] encodedData = new byte[encoder.encodedLength()];
        buffer.getBytes(0, encodedData);
        return encodedData;
    }

    public static byte[] sendExecutionReport(double amount, String currency, String side, String symbol, 
                                    double secondaryAmount, String secondaryCurrency, 
                                    String deliveryDate, String transactTime, String quoteRequestID, 
                                    String quoteID, String dealRequestID, String dealID, double fxRate) {
        ExecutionReportEncoder encoder = new ExecutionReportEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);
        
        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa((long) (amount * 10000)).exponent((byte) -4);
        
        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.secondaryCurrency(secondaryCurrency);
        
        DecimalEncoder secondaryAmountEncoder = new DecimalEncoder();
        secondaryAmountEncoder.wrap(buffer, encoder.secondaryAmount().offset()).mantissa((long) (secondaryAmount * 10000)).exponent((byte) -4);
        
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);
        encoder.dealID(dealID);
        
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa((long) (fxRate * 10000)).exponent((byte) -4);

        byte[] encodedData = new byte[encoder.encodedLength()];
        buffer.getBytes(0, encodedData);
        return encodedData;
    }

    public void sendBytes(Channel channel, byte[] encodedData) {
        channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(encodedData)));
    }
}
