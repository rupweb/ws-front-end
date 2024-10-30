package messages.toFix;

import java.net.URI;
import java.util.UUID;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import aeron.AeronClient;
import agrona.messages.ErrorDecoder;
import agrona.messages.MessageHeaderDecoder;
import app.App;
import io.aeron.Subscription;
import io.aeron.logbuffer.FragmentHandler;
import sbe.SbeEncoder;
import setup.Setup;
import setup.SetupSingleton;
import websockets.WebSocketClient;
import websockets.WebSocketClientHandler;

public class ErrorTest {
    private static final Logger log = LogManager.getLogger(ErrorTest.class);

    private volatile boolean testing = true;

    // Define error variables
    double amount;
    String currency;
    String side;
    String symbol;
    String deliveryDate;
    String transactTime;
    String quoteID;     
    String quoteRequestID; 
    String dealRequestID;
    String dealID;
    String clientID;
    double fxRate;
    double secondaryAmount;
    String message;

    @Test
    public void testSbeErrorToFix() throws Exception {
        log.info("Running testSbeErrorToFix");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and all the aeron subscriptions
         * 2. Setup an error subscription
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

        // Define error data
        amount = 1000;
        currency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        deliveryDate = "20250101";
        transactTime = "20240101-00:00:00.000";
        quoteID = guid;     
        quoteRequestID = guid;   
        dealRequestID = guid;
        dealID = guid + ".1";
        clientID = "TEST";
        fxRate = 1.23456;
        secondaryAmount = 810.01;
        message = "TEST";

        // Prepare listener on the main channel because everything is published there
        Subscription subscription = aeronClient.getAeron().addSubscription(AeronClient.BACKEND_TO_FIX_CHANNEL, AeronClient.BACKEND_TO_FIX_STREAM_ID);

        FragmentHandler fragmentHandler = (buffer, offset, length, header) -> {
            // Decode the message
            ErrorDecoder decoder = new ErrorDecoder();
            decoder.wrap(buffer, offset + MessageHeaderDecoder.ENCODED_LENGTH, ErrorDecoder.BLOCK_LENGTH, ErrorDecoder.SCHEMA_VERSION);

            // Verify the decoded message
            assertEquals((long) (amount * 100), decoder.amount().mantissa());
            assertEquals(-2, decoder.amount().exponent());
            assertEquals(currency, decoder.currency());
            assertEquals(side, decoder.side());
            assertEquals(symbol, decoder.symbol());
            assertEquals(deliveryDate, decoder.deliveryDate());
            assertEquals(transactTime, decoder.transactTime());
            assertEquals(quoteRequestID, decoder.quoteRequestID());
            assertEquals(quoteID, decoder.quoteID());
            assertEquals(dealRequestID, decoder.dealRequestID());
            assertEquals(dealID, decoder.dealID());
            assertEquals((long) (fxRate * 100000), decoder.fxRate().mantissa());
            assertEquals(-5, decoder.fxRate().exponent());
            assertEquals((long) (secondaryAmount * 100), decoder.secondaryAmount().mantissa());
            assertEquals(-2, decoder.secondaryAmount().exponent());
            assertEquals(clientID, decoder.clientID());
            assertEquals(message, decoder.message());

            log.info("Received and verified error message");

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
        DirectBuffer encodedMessageBuffer = sbeEncoder.encodeError(amount, currency, side, symbol, deliveryDate, 
            transactTime, quoteID, quoteRequestID, dealRequestID, dealID, fxRate, secondaryAmount, clientID, message);

        WebSocketClient webSocketClient = new WebSocketClient();
        webSocketClient.start();
        URI uri = WebSocketClient.getURI();

        // Connect to the server
        log.info("Connecting to server");
        WebSocketClientHandler handler = webSocketClient.connectToServer(uri);

        // Give the websocket a second to connect
        Setup.sleepSeconds(1);

        // Publish the error
        log.info("Publish message");
        handler.sendBinaryMessage(encodedMessageBuffer.byteArray());

        // Give the thing time
        Setup.sleepSeconds(2);

        log.info("Completed testSbeErrorToFix");

        // Clean up
        subscription.close();
        webSocketClient.close();
    }
}

