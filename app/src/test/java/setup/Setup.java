package setup;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Setup {
	private static final Logger log = LogManager.getLogger(Setup.class);
	
	private SharedTestResources sharedTestResources;

	public void start() {
		log.info("Start up shared test resources");
		sharedTestResources = new SharedTestResources();
		sharedTestResources.initialize();
	}

	public void stop() {
		log.info("Stop shared test resources");
		sharedTestResources.close();
	}
	
	public void manageWaitingForApp(int waitTime) throws Exception {
		long startTime = System.currentTimeMillis();
		long endTime = startTime + waitTime * 1000L; // Convert waitTime to milliseconds
		try {
			while (System.currentTimeMillis() < endTime) {
				if (WaitConditions.AppUp().call()) {
					log.info("App is up and running");
					return;
				}
				Thread.sleep(500); // Wait for 500 milliseconds before checking again
			}
			throw new Exception("App not started in " + waitTime + " seconds.");
		} catch (Exception cte) {
			log.error("App not started in " + waitTime + " seconds. SHUTTING DOWN");
			sharedTestResources.close();
	
			// Rethrow exception to indicate failure
			throw cte;
		}
	}
	
	public static void sleep(int duration) {
		try {
			Thread.sleep(duration);
		} catch (InterruptedException ie) {
			log.warn("Sleep interrupted");
			Thread.currentThread().interrupt();
		}
	}

	public static void sleepSeconds(int duration) {
		try {
			Thread.sleep(duration * 1000L);
		} catch (InterruptedException ie) {
			log.warn("Sleep interrupted");
			Thread.currentThread().interrupt();
		}
	}
}