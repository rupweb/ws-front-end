package backend;

import io.aeron.Aeron;
import io.aeron.driver.MediaDriver;

public class AeronConfiguration {
    public Aeron createAeron(MediaDriver mediaDriver) {
        Aeron.Context ctx = new Aeron.Context().aeronDirectoryName(mediaDriver.aeronDirectoryName());
        return Aeron.connect(ctx);
    }

    public MediaDriver createMediaDriver() {
        MediaDriver.Context mediaDriverCtx = new MediaDriver.Context()
            .aeronDirectoryName("/tmp/aeron-backend")
            .dirDeleteOnStart(true);
        return MediaDriver.launch(mediaDriverCtx);
    }
}

