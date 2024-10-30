package messages.fromFix;

import java.net.URI;
import java.util.UUID;

import org.agrona.DirectBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.Test;

import aeron.AeronClient;
import aeron.AeronSender;
import app.App;
import io.aeron.Publication;
import persistence.SqlMessage;
import sbe.SbeDecoder;
import sbe.SbeEncoder;
import setup.Setup;
import setup.SetupSingleton;
import websockets.WebSocketClient;
import websockets.WebSocketClientHandler;

public class ErrorTest {
    private static final Logger log = LogManager.getLogger(ErrorTest.class);

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
    public void testSbeErrorFromFix() throws Exception {
        log.info("Running testSbeErrorFromFix");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and all the aeron subscriptions
         * 2. Setup a websocket client to receive binary data
         * 3. Setup error publisher
         * 4. Create error
         * 5. Encode & send error on the publisher
         * 6. The websocket client checks the data
         */

        // Setup Websocket receiver
        WebSocketClient webSocketClient = setupWebSocket();

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

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer encodedMessageBuffer = sbeEncoder.encodeError(amount, currency, side, symbol, deliveryDate, 
            transactTime, quoteID, quoteRequestID, dealRequestID, dealID, fxRate, secondaryAmount, clientID, message);

        // Publish the error
        Publication testErrorPublication = aeronClient.getAeron().addPublication(AeronClient.FIX_TO_BACKEND_CHANNEL, AeronClient.FIX_TO_BACKEND_STREAM_ID);

        // Sender
        log.info("Publish message");
        AeronSender sender = new AeronSender();
        sender.setPublication(testErrorPublication);
        sender.send(encodedMessageBuffer, "error");

        // Give the thing time
        Setup.sleepSeconds(1);

        log.info("Completed testSbeErrorFromFix");

        // Clean up
        testErrorPublication.close();
        webSocketClient.close();
    }

    private WebSocketClient setupWebSocket() throws Exception {
        // Setup websocket client
        WebSocketClient webSocketClient = new WebSocketClient();
        webSocketClient.start();
        URI uri = WebSocketClient.getURI();

        // Connect to the server
        log.info("Connecting to server");
        WebSocketClientHandler handler = webSocketClient.connectToServer(uri);

        // Prepare for response
        SbeDecoder sbeDecoder = new SbeDecoder();

        Thread.startVirtualThread(() -> {
            byte[] response;
            try {
                response = handler.getBinaryResponse();
                testResponse(sbeDecoder.decode(response));
            } catch (InterruptedException e) {
                log.error(e.getMessage());
            }
        });

        return webSocketClient;
    }

    private void testResponse(SqlMessage helperClass) {
        if (helperClass instanceof messages.Error error) {
        
            assertEquals(amount, error.getAmount().doubleValue());
            assertEquals(currency, error.getCurrency());
            assertEquals(side, error.getSide());
            assertEquals(symbol, error.getSymbol());
            assertEquals(deliveryDate, error.getDeliveryDate());
            assertEquals(transactTime, error.getTransactTime());
            assertEquals(quoteID, error.getQuoteID());
            assertEquals(quoteRequestID, error.getQuoteRequestID());
            assertEquals(dealRequestID, error.getDealRequestID());
            assertEquals(dealID, error.getDealID());
            assertEquals(clientID, error.getClientID());
            assertEquals(fxRate, error.getFxRate().doubleValue());
            assertEquals(secondaryAmount, error.getSecondaryAmount().doubleValue());
            assertEquals(message, error.getMessage());

            log.info("Received and verified error message");
        } else {
            fail("Expected an Error but received: " + helperClass.getClass().getSimpleName());
        }
    }
}

