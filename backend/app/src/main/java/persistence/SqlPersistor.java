package persistence;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import messages.BusinessClient;
import messages.Client;

public class SqlPersistor implements Runnable {

    private static final Logger LOGGER = Logger.getLogger(SqlPersistor.class.getName());

    private final Thread thread = new Thread(this);
    private static volatile boolean isRunning = false;
    private final ExecutorService executorService = Executors.newFixedThreadPool(4);

    public Thread getThread() {
        return thread;
    }

    private static void setRunning(boolean b) {
        isRunning = b;
    }

    public void start() {
        LOGGER.info("Starting SqlPersistor thread");

        if (!isRunning) {
            setRunning(true);
            thread.setName("SqlPersistorThread");
            thread.start();
            LOGGER.info("Started " + thread.getName());
        } else {
            LOGGER.warning(thread.getName() + " is already running");
        }
    }

    @Override
    public void run() {
        LOGGER.info("SqlPersistor thread running");

        try {
            while (isRunning) {
                String json = PersistenceQueue.getInstance().getQueue().take();
                persistMessage(json);
                LOGGER.fine("Waiting for another SqlMessage");
            }
        } catch (InterruptedException ie) {
            LOGGER.warning(thread.getName() + " was interrupted");
        }

        LOGGER.info("SqlPersistor thread stopped");
    }

    private void persistMessage(String json) {
        executorService.submit(() -> {
            if (!thread.isInterrupted()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode jsonNode = objectMapper.readTree(json);
    
                    if (jsonNode.has("type")) {
                        String messageType = jsonNode.get("type").asText();
                        
                        // Handle "welcome" and "ping" messages
                        if (messageType.equals("welcome")) {
                            LOGGER.info("Received 'welcome' message: " + jsonNode.toString());
                            return;
                        } else if (messageType.equals("ping")) {
                            LOGGER.info("Received 'ping' message: " + jsonNode.toString());
                            return;
                        }
                    }
    
                    // Check for "clientType" field and handle accordingly
                    if (jsonNode.has("clientType") && !jsonNode.get("clientType").isNull()) {
                        String clientType = jsonNode.get("clientType").asText();
                        JsonNode dataNode = jsonNode.get("data");
    
                        if (clientType.equals("individual")) {
                            Client client = objectMapper.treeToValue(dataNode, Client.class);
                            client.persistToSQLite();
                            LOGGER.info("Persisted individual client: " + client.toString());
                        } else if (clientType.equals("corporate")) {
                            BusinessClient businessClient = objectMapper.treeToValue(dataNode, BusinessClient.class);
                            businessClient.persistToSQLite();
                            LOGGER.info("Persisted corporate client: " + businessClient.toString());
                        } else {
                            LOGGER.severe("Unknown clientType: " + clientType);
                        }
                    } else {
                        LOGGER.warning("Failed to persist message: " + json);
                    }
                } catch (Exception e) {
                    LOGGER.severe("Failed to persist message: " + e.getMessage());
                }
            }
        });
    }
    

    public void stop() throws InterruptedException {
        LOGGER.info("Stopping SqlPersistor thread");

        if (!isRunning) {
            LOGGER.info(thread.getName() + " is already set to stop");
            if (thread.isAlive()) {
                LOGGER.info(thread.getName() + " is still alive. Interrupting again");
                thread.interrupt();
                thread.join(10); // Allow 10 milliseconds to wait for thread interrupt
            }
        } else {
            setRunning(false);
            thread.interrupt();
            thread.join(10); // Allow 10 milliseconds to wait for thread interrupt
        }

        if (thread.isAlive()) {
            executorService.shutdownNow();
            LOGGER.info(thread.getName() + " is still alive. Executor shutdown initiated");

            try {
                executorService.awaitTermination(2, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                LOGGER.severe("Executor service termination interrupted");
            }
        }

        LOGGER.info("SqlPersistor thread stopped");
    }
}
