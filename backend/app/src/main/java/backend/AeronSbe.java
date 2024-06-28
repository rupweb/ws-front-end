package backend;

import agrona.messages.DealRequestEncoder;
import agrona.messages.QuoteRequestEncoder;
import agrona.messages.DealRequestDecoder;
import agrona.messages.QuoteRequestDecoder;
import io.aeron.Publication;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.BackoffIdleStrategy;
import org.agrona.concurrent.IdleStrategy;
import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class AeronSbe {
    private static final Logger logger = LogManager.getLogger(AeronSbe.class);
    private final Publication publication;
    private final Subscription subscription;

    public AeronSbe(Publication publication, Subscription subscription) {
        this.publication = publication;
        this.subscription = subscription;
    }

    public void sendDealRequestToAeron(double amount, String currency, String side, String symbol, 
                                       String deliveryDate, String transactTime, String quoteRequestID, 
                                       String quoteID, String dealRequestID, String ticketRef, double fxRate) {
        DealRequestEncoder encoder = new DealRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[DealRequestEncoder.BLOCK_LENGTH]);
        
        encoder.wrap(buffer, 0)
               .amount().mantissa((long) (amount * 10000)).exponent((byte) -4);
        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);
        encoder.ticketRef(ticketRef);
        encoder.fxRate().mantissa((long) (fxRate * 10000)).exponent((byte) -4);
        
        while (publication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    public void sendQuoteRequestToAeron(double salePrice, String saleCurrency, String deliveryDate, 
                                        String transactTime, String quoteRequestID, 
                                        String side, String symbol, String currencyOwned) {
        QuoteRequestEncoder encoder = new QuoteRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[QuoteRequestEncoder.BLOCK_LENGTH]);

        encoder.wrap(buffer, 0)
               .amount().mantissa((long) (salePrice * 10000)).exponent((byte) -4);
        encoder.saleCurrency(saleCurrency);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.currencyOwned(currencyOwned);

        while (publication.offer(buffer) < 0L) {
            // Implement back-off or error handling here
        }
    }

    FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
        int messageType = getMessageType(buffer, offset); // Implement getMessageType method to identify message type

        switch (messageType) {
            case DealRequestDecoder.TEMPLATE_ID:
                decodeDealRequest(buffer, offset);
                break;
            case QuoteRequestDecoder.TEMPLATE_ID:
                decodeQuoteRequest(buffer, offset);
                break;
            default:
                logger.error("Unknown message type: {}", messageType);
        }
    };

    private int getMessageType(DirectBuffer buffer, int offset) {
        // Implement this method to extract and return the message type from the buffer
        // This is typically done by reading the message header
        return buffer.getInt(offset); // Placeholder implementation, assuming the message type is stored at the beginning
    }

    private void decodeDealRequest(DirectBuffer buffer, int offset) {
        DealRequestDecoder decoder = new DealRequestDecoder();
        decoder.wrap(buffer, offset, DealRequestDecoder.BLOCK_LENGTH, DealRequestDecoder.SCHEMA_VERSION);

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

        logger.info("Received DealRequest - Amount: {}, Currency: {}, Side: {}, Symbol: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, QuoteID: {}, DealRequestID: {}, TicketRef: {}, FxRate: {}",
                amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, ticketRef, fxRate);

        // Forward the decoded data to the FIX engine or other processing logic here
        forwardToFixEngine(amount, currency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, dealRequestID, ticketRef, fxRate);
    }

    private void decodeQuoteRequest(DirectBuffer buffer, int offset) {
        QuoteRequestDecoder decoder = new QuoteRequestDecoder();
        decoder.wrap(buffer, offset, QuoteRequestDecoder.BLOCK_LENGTH, QuoteRequestDecoder.SCHEMA_VERSION);

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

        logger.info("Received QuoteRequest - SalePrice: {}, SaleCurrency: {}, DeliveryDate: {}, TransactTime: {}, QuoteRequestID: {}, Side: {}, Symbol: {}, CurrencyOwned: {}",
                salePrice, saleCurrency, deliveryDate, transactTime, quoteRequestID, side, symbol, currencyOwned);

        // Forward the decoded data to the FIX engine or other processing logic here
        forwardToFixEngine(salePrice, saleCurrency, deliveryDate, transactTime, quoteRequestID, side, symbol, currencyOwned);
    }

    private void forwardToFixEngine(double salePrice, String saleCurrency, String deliveryDate, 
                                    String transactTime, String quoteRequestID, String side, 
                                    String symbol, String currencyOwned) {
        // Implement the logic to forward the decoded data to the FIX engine
    }

    private void forwardToFixEngine(double amount, String currency, String side, String symbol, 
                                    String deliveryDate, String transactTime, String quoteRequestID, 
                                    String quoteID, String dealRequestID, String ticketRef, double fxRate) {
        // Implement the logic to forward the decoded data to the FIX engine
    }

    public void listen() {
        final IdleStrategy idleStrategy = new BackoffIdleStrategy(100, 1000, 1, 1);
        while (true) {
            final int fragments = subscription.poll(fragmentHandler, 10);
            idleStrategy.idle(fragments);
        }
    }
}
