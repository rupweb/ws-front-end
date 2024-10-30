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
import messages.ExecutionReport;
import persistence.SqlMessage;
import sbe.SbeDecoder;
import sbe.SbeEncoder;
import setup.Setup;
import setup.SetupSingleton;
import websockets.WebSocketClient;
import websockets.WebSocketClientHandler;

public class DealTest {
    private static final Logger log = LogManager.getLogger(DealTest.class);

    // Define variables
    double amount;
    String currency;
    String side;
    String symbol;
    String deliveryDate;
    String transactTime;
    String quoteID;     
    String quoteRequestID;
    String dealID;     
    String dealRequestID;
    String clientID;
    double fxRate;
    double secondaryAmount; 
    String secondaryCurrency; 

    @Test
    public void testSbeDeal() throws Exception {
        log.info("Running testSbeDeal");

        // Setup test resources
        SetupSingleton.getInstance();

        /*
         * 1. Start the app and all the aeron subscriptions
         * 2. Setup a websocket client to receive binary data
         * 3. Setup publisher
         * 4. Create ExecutionReport
         * 5. Encode & send ExecutionReport on the publisher
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

        // Expected data
        amount = 100000; // Example amount
        currency = "USD";
        secondaryAmount = 85000; // Example secondary amount
        secondaryCurrency = "EUR";
        side = "SELL";
        symbol = "USDJPY";
        deliveryDate = "20240103";
        transactTime = "20240101-14:00:00.000";
        quoteRequestID = guid;
        quoteID = guid + ".1";
        dealRequestID = guid;
        dealID = guid + ".1";
        clientID = "TEST";
        fxRate = 109.45;

        // Initialize the encoder
        SbeEncoder sbeEncoder = new SbeEncoder();

        // Define the data to encode
        DirectBuffer encodedMessageBuffer = sbeEncoder.encodeExecutionReport(amount, currency, secondaryAmount, 
            secondaryCurrency, side, symbol, deliveryDate, transactTime, quoteRequestID, quoteID, 
            dealRequestID, dealID, clientID, fxRate);

        // Publish the deal
        Publication testDealPublication = aeronClient.getAeron().addPublication(AeronClient.FIX_TO_BACKEND_CHANNEL, AeronClient.FIX_TO_BACKEND_STREAM_ID);

        // Sender
        log.info("Publish message");
        AeronSender sender = new AeronSender();
        sender.setPublication(testDealPublication);
        sender.send(encodedMessageBuffer, "deal");

        // Give the thing time
        Setup.sleepSeconds(2);

        log.info("Completed testSbeDeal");

        // Give the websocket time to process
        Setup.sleepSeconds(1);

        // Clean up test subscription
        testDealPublication.close();
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
        if (helperClass instanceof ExecutionReport executionReport ) {
        
            assertEquals(amount, executionReport.getAmount().doubleValue());
            assertEquals(currency, executionReport.getCurrency());
            assertEquals(secondaryAmount, executionReport.getSecondaryAmount().doubleValue());
            assertEquals(secondaryCurrency, executionReport.getSecondaryCurrency());
            assertEquals(side, executionReport.getSide());
            assertEquals(symbol, executionReport.getSymbol());
            assertEquals(deliveryDate, executionReport.getDeliveryDate());
            assertEquals(transactTime, executionReport.getTransactTime());
            assertEquals(quoteID, executionReport.getQuoteID());
            assertEquals(quoteRequestID, executionReport.getQuoteRequestID());
            assertEquals(dealRequestID, executionReport.getDealRequestID());
            assertEquals(dealID, executionReport.getDealID());
            assertEquals(clientID, executionReport.getClientID());
            assertEquals(fxRate, executionReport.getFxRate().doubleValue());
 
            log.info("Received and verified deal message");
        } else {
            fail("Expected an ExecutionReport but received: " + helperClass.getClass().getSimpleName());
        }
    }
}
