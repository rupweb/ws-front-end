package messages.toFix;

import java.net.URI;
import java.util.UUID;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import aeron.AeronClient;
import agrona.messages.MessageHeaderDecoder;
import agrona.messages.QuoteRequestDecoder;
import app.App;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import sbe.SbeEncoder;
import setup.Setup;
import setup.SetupSingleton;
import websockets.WebSocketClient;
import websockets.WebSocketClientHandler;

public class QuoteRequestTest {
    private static final Logger log = LogManager.getLogger(QuoteRequestTest.class);

    private volatile boolean testing = true;

    // Define variables
    double amount;
    String saleCurrency;
    String side;
    String symbol;
    String deliveryDate;
    String transactTime;
    String quoteRequestID; 
    String currencyOwned;
    String clientID;

    @Test
    public void testSbeQuoteRequest() throws Exception {
        log.info("Running testSbeQuoteRequest");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and all the aeron subscriptions
         * 2. Setup a deal request subscription
         * 3. Setup a deal request websocket
         * 4. Create a deal request
         * 5. Encode & send the deal request on the websocket
         * 6. Check the subscription receives the request
         */

        // Get AeronClient
        AeronClient aeronClient = App.getAeronClient();

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Define quote request data
        amount = 1000;
        saleCurrency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        deliveryDate = "20250101";
        transactTime = "20240101-00:00:00.000";  
        quoteRequestID = guid;
        currencyOwned = "EUR";
        clientID = "TEST";

        // Prepare listener
        Subscription subscription = aeronClient.getAeron().addSubscription(AeronClient.BACKEND_TO_FIX_CHANNEL, AeronClient.BACKEND_TO_FIX_STREAM_ID);

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            // Decode the message
            QuoteRequestDecoder decoder = new QuoteRequestDecoder();
            decoder.wrap(buffer, offset + MessageHeaderDecoder.ENCODED_LENGTH, QuoteRequestDecoder.BLOCK_LENGTH, QuoteRequestDecoder.SCHEMA_VERSION);
            
            // Verify the decoded message
            assertEquals((long) (amount * 100), decoder.amount().mantissa());
            assertEquals(-2, decoder.amount().exponent());
            assertEquals(saleCurrency, decoder.saleCurrency());
            assertEquals(currencyOwned, decoder.currencyOwned());
            assertEquals(side, decoder.side());
            assertEquals(symbol, decoder.symbol());
            assertEquals(deliveryDate, decoder.deliveryDate());
            assertEquals(transactTime, decoder.transactTime());
            assertEquals(quoteRequestID, decoder.quoteRequestID());
            assertEquals(clientID, decoder.clientID());
            
            log.info("Received and verified quote request message");
            
            testing = false;
        };

        Thread.startVirtualThread(() -> {
            while (testing) {
                subscription.poll(fragmentHandler, 10);
            }
        });
        
        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer encodedMessageBuffer = sbeEncoder.encodeQuoteRequest(amount, saleCurrency, 
            side, symbol, deliveryDate, transactTime, quoteRequestID, currencyOwned, clientID);

        WebSocketClient webSocketClient = new WebSocketClient();
        webSocketClient.start();
        URI uri = WebSocketClient.getURI();

        // Connect to the server
        log.info("Connecting to server");
        WebSocketClientHandler handler = webSocketClient.connectToServer(uri);

        // Give the websocket a second to connect
        Setup.sleepSeconds(1);

        // Publish the quote request
        log.info("Publish message");
        handler.sendBinaryMessage(encodedMessageBuffer.byteArray());

        // Give the thing time
        Setup.sleepSeconds(1);

        log.info("Completed testSbeQuoteRequest");

        // Clean up
        subscription.close();
        webSocketClient.close();
    }
}

