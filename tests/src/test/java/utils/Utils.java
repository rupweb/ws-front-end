package utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Utils {

    /**
     * Loads a JavaScript file as a string from the given relative path.
     * 
     * @param relativePath The relative path of the script file to load.
     * @return The contents of the script file as a string.
     * @throws IOException If there is an error reading the file.
     */
    public static String loadScript(String relativePath) throws IOException {
        String projectRoot = System.getProperty("user.dir");

        if (projectRoot.endsWith("\\tests")) {
            projectRoot = projectRoot.substring(0, projectRoot.length() - 6);
        }

        String fullPath = Paths.get(projectRoot, relativePath).toString();
        return new String(Files.readAllBytes(Paths.get(fullPath)));
    }

    /**
     * Converts an ES6 script to a CommonJS-compatible script.
     * 
     * @param es6Script The ES6 script content as a string.
     * @return The modified script with import and export statements removed.
     */
    public static String convertES6ToCommonJS(String es6Script) {
        return es6Script
            .replaceAll("import\\s+.*?;", "")
            .replaceAll("export\\s+default\\s+", "");
    }

    /**
     * Converts an script.
     * 
     * @param script The JS script content as a string.
     * @return The modified script with import and export lines removed.
     */    
    public static String removeJSImportExport(String script) {
        StringBuilder result = new StringBuilder();
        String[] lines = script.split("\\R");
    
        for (String line : lines) {
            if (!line.trim().startsWith("import") && !line.trim().startsWith("export")) {
                result.append(line).append(System.lineSeparator());
            }
        }
        
        return result.toString();
    }   
}
