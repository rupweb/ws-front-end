package persistence;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

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
            LOGGER.log(Level.INFO, "Started {0}", thread.getName());
        } else {
            LOGGER.log(Level.WARNING, "{0} is already running", thread.getName());
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
            LOGGER.log(Level.WARNING, "{0} was interrupted", thread.getName());
        }

        LOGGER.info("SqlPersistor thread stopped");
    }

    private void persistMessage(String json) {
        executorService.submit(new Runnable() {
            @Override
            public void run() {
                if (!thread.isInterrupted()) {
                    try {
                        ObjectMapper objectMapper = new ObjectMapper();
                        JsonNode jsonNode = objectMapper.readTree(json);
                        
                        if (jsonNode.has("type")) {
                            String messageType = jsonNode.get("type").asText();
                            
                            // Handle "welcome" and "ping" messages
                            if (messageType.equals("welcome")) {
                                LOGGER.log(Level.INFO, "Received ''welcome'' message: {0}", jsonNode.toString());
                                return;
                            } else if (messageType.equals("ping")) {
                                LOGGER.log(Level.INFO, "Received ''ping'' message: {0}", jsonNode.toString());
                                return;
                            }
                        }
                        
                        // Check for "clientType" field and handle accordingly
                        if (jsonNode.has("clientType") && !jsonNode.get("clientType").isNull()) {
                            String clientType = jsonNode.get("clientType").asText();
                            JsonNode dataNode = jsonNode.get("data");
                            
                            if (clientType.equals("individual")) {
                                Client client = objectMapper.treeToValue(dataNode, Client.class);
                                client.persistToSQLite(SqLiteInitializer.URL);
                                LOGGER.log(Level.INFO, "Persisted individual client: {0}", client.toString());
                            } else if (clientType.equals("corporate")) {
                                BusinessClient businessClient = objectMapper.treeToValue(dataNode, BusinessClient.class);
                                businessClient.persistToSQLite(SqLiteInitializer.URL);
                                LOGGER.log(Level.INFO, "Persisted corporate client: {0}", businessClient.toString());
                            } else {
                                LOGGER.log(Level.SEVERE, "Unknown clientType: {0}", clientType);
                            }
                        } else {
                            LOGGER.log(Level.WARNING, "Failed to persist message: {0}", json);
                        }
                    } catch (JsonProcessingException | IllegalArgumentException e) {
                        LOGGER.log(Level.SEVERE, "Failed to persist message: {0}", e.getMessage());
                    }
                }
            }
        });
    }
    

    public void stop() throws InterruptedException {
        LOGGER.info("Stopping SqlPersistor thread");

        if (!isRunning) {
            LOGGER.log(Level.INFO, "{0} is already set to stop", thread.getName());
            if (thread.isAlive()) {
                LOGGER.log(Level.INFO, "{0} is still alive. Interrupting again", thread.getName());
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
            LOGGER.log(Level.INFO, "{0} is still alive. Executor shutdown initiated", thread.getName());

            try {
                executorService.awaitTermination(2, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                LOGGER.severe("Executor service termination interrupted");
            }
        }

        LOGGER.info("SqlPersistor thread stopped");
    }
}
