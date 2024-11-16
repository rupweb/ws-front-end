package utils;

import java.lang.management.ManagementFactory;
import java.net.InetAddress;

import messages.Admin;

public class ProcessUtil {
    public static long getProcessId() {
        String processName = ManagementFactory.getRuntimeMXBean().getName();
        return Long.parseLong(processName.split("@")[0]);
    }

    public static Admin getAdminMessage(String messageType, String detailedMessage) {

        // Send an Admin message when the Quoter starts
        String applicationName = System.getProperty("application.name", "ws-front-end");
        String instanceId = String.valueOf(ProcessHandle.current().pid());
        String environment = System.getenv().getOrDefault("APP_ENV", "DEV");
        long timestamp = System.currentTimeMillis();
        String hostInfo = getHostInfo();

        if (detailedMessage.isEmpty())
            detailedMessage = System.getProperty("user.dir");

        return new Admin(applicationName, instanceId, environment, messageType, timestamp, detailedMessage, hostInfo);
    }

    public static String getHostInfo() {
        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            return inetAddress.getHostName() + " (" + inetAddress.getHostAddress() + ")";
        } catch (Exception e) {
            return "Unknown host";
        }
    }
}