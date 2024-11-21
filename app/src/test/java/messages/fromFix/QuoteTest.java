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
import app.App;
import io.aeron.Publication;
import messages.Quote;
import persistence.SqlMessage;
import sbe.SbeDecoder;
import sbe.SbeEncoder;
import setup.Setup;
import setup.SetupSingleton;
import sharedJava.aeron.AeronSender;
import websockets.WebSocketClient;
import websockets.WebSocketClientHandler;

public class QuoteTest {
    private static final Logger log = LogManager.getLogger(QuoteTest.class);

    // Define variables
    double amount;
    String currency;
    String side;
    String symbol;
    String transactTime;
    String quoteID;     
    String quoteRequestID; 
    double fxRate;
    double secondaryAmount;
    String clientID;

    @Test
    public void testSbeQuote() throws Exception {
        log.info("Running testSbeQuote");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and all the aeron subscriptions
         * 2. Setup a websocket client to receive binary data
         * 3. Setup quote publisher
         * 4. Create quote
         * 5. Encode & send quote on the publisher
         * 6. The websocket client checks the data
         */

        // Setup Websocket receiver
        WebSocketClient webSocketClient = setupWebSocket();

        // Give the websocket a second to connect
        Setup.sleepSeconds(1);

        // Get AeronClient
        AeronClient aeronClient = App.getAeronClient();

        // Create a random GUID
        UUID uuid = UUID.randomUUID();
        String guid = uuid.toString().substring(0, 8).toUpperCase();

        // Define quote data
        amount = 1000;
        currency = "USD";
        side = "BUY";
        symbol = "EURUSD";
        transactTime = "20240101-00:00:00.000";
        quoteID = guid;     
        quoteRequestID = guid;   
        fxRate = 1.23456;
        secondaryAmount = 810.01;
        clientID = "TEST";

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer encodedMessageBuffer = sbeEncoder.encodeQuote(amount, currency, side, symbol, 
            transactTime, quoteID, quoteRequestID, fxRate, secondaryAmount, clientID);

        // Publish the quote
        Publication testQuotePublication = aeronClient.getAeron().addPublication(AeronClient.FIX_TO_BACKEND_CHANNEL, AeronClient.FIX_TO_BACKEND_STREAM_ID);

        // Sender
        log.info("Publish message");
        AeronSender sender = new AeronSender();
        sender.setPublication(testQuotePublication, 2);
        sender.send(encodedMessageBuffer, "quote");

        // Give the thing time
        Setup.sleepSeconds(1);

        log.info("Completed testSbeQuote");

        // Clean up
        testQuotePublication.close();
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
        if (helperClass instanceof Quote quote) {
        
            assertEquals(amount, quote.getAmount().doubleValue());
            assertEquals(currency, quote.getCurrency());
            assertEquals(side, quote.getSide());
            assertEquals(symbol, quote.getSymbol());
            assertEquals(transactTime, quote.getTransactTime());
            assertEquals(quoteID, quote.getQuoteID());
            assertEquals(quoteRequestID, quote.getQuoteRequestID());
            assertEquals(fxRate, quote.getFxRate().doubleValue());
            assertEquals(secondaryAmount, quote.getSecondaryAmount().doubleValue());
            assertEquals(clientID, quote.getClientID());

            log.info("Received and verified quote message");
        } else {
            fail("Expected a Quote but received: " + helperClass.getClass().getSimpleName());
        }
    }
}

