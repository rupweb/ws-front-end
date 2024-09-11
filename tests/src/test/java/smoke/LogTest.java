package smoke;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;

public class LogTest {
    private static final Logger logger = LogManager.getLogger(LogTest.class);

    @Test
    public void Log4j2Test(){
        System.out.println("Hello World!");
        logger.info( "Hello World!" );
    }
}
