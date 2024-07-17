package backend;

import agrona.messages.DealRequestEncoder;
import agrona.messages.ExecutionReportEncoder;
import agrona.messages.QuoteEncoder;
import agrona.messages.QuoteRequestEncoder;
import agrona.messages.DecimalEncoder;
import agrona.messages.MessageHeaderEncoder;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import messaging.SbeEncoder;

public class WebSocketSbeEncoding {
    // Initialize the encoder
    SbeEncoder sbeEncoder = new SbeEncoder();

    public byte[] encodeDealRequest(double amount, String currency, String side, String symbol, 
                                           String deliveryDate, String transactTime, String quoteRequestID, 
                                           String quoteID, String dealRequestID, double fxRate) {

        DirectBuffer buffer = sbeEncoder.encodeDealRequest(amount, currency, side, symbol, deliveryDate,
                transactTime, quoteRequestID, quoteID, dealRequestID, fxRate);
        return buffer.byteArray();
    }

    public byte[] encodeQuoteRequest(double amount, String saleCurrency, String side, String symbol, 
                                   String deliveryDate, String transactTime, String quoteRequestID, String currencyOwned) {

        DirectBuffer buffer = sbeEncoder.encodeQuoteRequest(amount, saleCurrency, side, symbol, deliveryDate,
                transactTime, quoteRequestID, currencyOwned);
        return buffer.byteArray();
    }

    public byte[] encodeQuote(double amount, String currency, String side, String symbol, 
                            String transactTime, String quoteRequestID, String quoteID, double fxRate) {

        DirectBuffer buffer = sbeEncoder.encodeQuote(amount, currency, side, symbol, transactTime,
                quoteRequestID, quoteID, fxRate);
        return buffer.byteArray();
    }

    public byte[] sendExecutionReport(double amount, String currency, String side, String symbol, double secondaryAmount, 
                                    String secondaryCurrency, String deliveryDate, String transactTime, String quoteRequestID, String quoteID, 
                                    String dealRequestID, String dealID, double fxRate) {

        DirectBuffer buffer = sbeEncoder.encodeExecutionReport(amount, currency, side, symbol, secondaryAmount,
                secondaryCurrency, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, dealID, fxRate);
        return buffer.byteArray();
    }

    public void sendBytes(Channel channel, byte[] encodedData) {
        channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(encodedData)));
    }
}
