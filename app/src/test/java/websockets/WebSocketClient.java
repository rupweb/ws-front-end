package websockets;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.net.ssl.SSLException;
import java.net.URI;
import java.net.URISyntaxException;

import app.AppConfig;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.websocketx.WebSocketClientProtocolConfig;
import io.netty.handler.codec.http.websocketx.WebSocketClientProtocolHandler;
import io.netty.handler.codec.http.websocketx.WebSocketVersion;

public class WebSocketClient {
    private static final Logger log = LogManager.getLogger(WebSocketClient.class);

    private AppConfig appConfig;
    private int webSocketPort;
    private static URI uri;
    public static URI getURI() { return uri; }

    private static EventLoopGroup group;
    private static WebSocketClientHandler clientHandler;

    public void start() throws URISyntaxException {
        log.info("Init WebSocketClient");

        appConfig = new AppConfig("application.properties");
        webSocketPort = Integer.parseInt(appConfig.getProperty("websocket.port"));
        log.info("Websocket port: " + webSocketPort);

        uri = new URI("ws://localhost:" + webSocketPort + "/ws");
    }

    public WebSocketClientHandler connectToServer(URI uri) throws InterruptedException, SSLException, URISyntaxException {
        log.info("In connectToServer with URI: {}", uri.toString());

        group = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        clientHandler = new WebSocketClientHandler();
    
        WebSocketClientProtocolConfig config = WebSocketClientProtocolConfig.newBuilder()
            .webSocketUri(uri)
            .version(WebSocketVersion.V13)
            .allowExtensions(true)
            .build();
    
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel ch) throws Exception {
                        log.info("Setting up channel pipeline");
                        ChannelPipeline pipeline = ch.pipeline();
                        pipeline.addLast(new HttpClientCodec());
                        pipeline.addLast(new HttpObjectAggregator(8192));
                        pipeline.addLast(new WebSocketClientProtocolHandler(config));
                        pipeline.addLast(clientHandler);
                    }
                });
    
        // Connect to the server and wait for the handshake to complete
        log.info("Connect to server");
        bootstrap.connect(uri.getHost(), webSocketPort).sync().channel();
 
        log.info("Out connectToServer");
        return clientHandler;
    }

    public void close() {
        if (group != null) {
            group.shutdownGracefully();
        }
    }
}
