package backend;

import org.agrona.DirectBuffer;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import sbe.SbeEncoder;

public class WebSocketSbeEncoding {
    // Initialize the encoder
    SbeEncoder sbeEncoder = new SbeEncoder();

    public byte[] encodeDealRequest(double amount, String currency, String side, String symbol, 
                                           String deliveryDate, String transactTime, String quoteRequestID, String quoteID, 
                                           String dealRequestID, double fxRate, double secondaryAmount, String clientID) {

        DirectBuffer buffer = sbeEncoder.encodeDealRequest(amount, currency, side, symbol, deliveryDate, transactTime, 
                                                            quoteRequestID, quoteID, dealRequestID, fxRate, secondaryAmount, clientID);
        return buffer.byteArray();
    }

    public byte[] encodeQuoteRequest(double amount, String saleCurrency, String side, String symbol, String deliveryDate, 
                                        String transactTime, String quoteRequestID, String currencyOwned, String clientID) {

        DirectBuffer buffer = sbeEncoder.encodeQuoteRequest(amount, saleCurrency, side, symbol, deliveryDate, transactTime, 
                                                            quoteRequestID, currencyOwned, clientID);
        return buffer.byteArray();
    }

    public byte[] encodeQuote(double amount, String currency, String side, String symbol, String transactTime, 
                                String quoteID, String quoteRequestID, double fxRate, double secondaryAmount, String clientID) {

        DirectBuffer buffer = sbeEncoder.encodeQuote(amount, currency, side, symbol, transactTime,
                                                    quoteID, quoteRequestID, fxRate, secondaryAmount, clientID);
        return buffer.byteArray();
    }

    public byte[] sendExecutionReport(double amount, String currency, double secondaryAmount, String secondaryCurrency, 
                                    String side, String symbol, String deliveryDate, String transactTime, 
                                    String quoteRequestID, String quoteID, String dealRequestID, String dealID, String clientID, double fxRate) {

        DirectBuffer buffer = sbeEncoder.encodeExecutionReport(amount, currency, secondaryAmount, secondaryCurrency, 
                                                                side, symbol, deliveryDate, transactTime, 
                                                                quoteRequestID, quoteID, dealRequestID, dealID, clientID, fxRate);
        return buffer.byteArray();
    }

    public void sendBytes(Channel channel, byte[] encodedData) {
        channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(encodedData)));
    }
}
