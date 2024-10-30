package backend;

import java.lang.management.ManagementFactory;

public class ProcessUtil {
    public static long getProcessId() {
        String processName = ManagementFactory.getRuntimeMXBean().getName();
        return Long.parseLong(processName.split("@")[0]);
    }
}

