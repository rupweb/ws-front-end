package setup;

import java.util.concurrent.Callable;

import app.App;

public class WaitConditions {

    public static Callable<Boolean> AppUp() {
        return App::getRunning;
    }
}
