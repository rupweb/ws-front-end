package persistence;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class PersistenceQueue {

	private static PersistenceQueue instance;

	public static PersistenceQueue getInstance() {

		if (instance == null)
			return new PersistenceQueue();
		else
			return instance;
	}

	private void setInstance() {
		instance = this;
	}

	private final BlockingQueue<String> queue = new ArrayBlockingQueue<>(100);

	public BlockingQueue<String> getQueue() {
		return queue;
	}

	public PersistenceQueue() {

		if (instance != null)
			return;

		setInstance();
	}
}
