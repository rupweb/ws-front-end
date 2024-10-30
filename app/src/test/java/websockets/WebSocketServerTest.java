package websockets;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.handler.stream.ChunkedWriteHandler;
import setup.SetupSingleton;

import app.App;
import backend.WebSocketFrameHandler;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;

public class WebSocketServerTest {
    private static final Logger log = LogManager.getLogger(WebSocketServerTest.class);

    private int webSocketPort;
    private EventLoopGroup group;

    @Test
    public void testWebSocketBroadcast() throws Exception {
        log.info("In testWebSocketBroadcast");
        /*
         * 1. Start the app and the websocket server thread
         * 2. Setup a client
         * 3. Run a test message
         */

        // Setup test resources
        SetupSingleton.getInstance();
        webSocketPort = App.getWebSocketPort();

        URI uri = new URI("ws://localhost:" + webSocketPort + "/ws");
        CountDownLatch latch = new CountDownLatch(1);
        String expectedMessage = "Hello, WebSocket!";
        String[] receivedMessage = new String[1];

        group = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<Channel>() {
                    @Override
                    protected void initChannel(Channel ch) throws Exception {
                        ch.pipeline().addLast(
                                new HttpClientCodec(),
                                new HttpObjectAggregator(8192),
                                new ChunkedWriteHandler(),
                                new WebSocketClientProtocolHandler(getClientConfig(uri)),
                                webSocketFrameHandler(receivedMessage, latch, expectedMessage));
                    }
                });

        // Connect the client to the server
        log.info("In Connecting client to server");
        bootstrap.connect("localhost", webSocketPort).sync().channel();
        assertTrue(latch.await(5, TimeUnit.SECONDS));

        // Assert that the message received matches the expected broadcast message
        log.info("Received: {}", receivedMessage[0]);
        assertEquals(expectedMessage, receivedMessage[0]);
    }

    protected WebSocketClientProtocolConfig getClientConfig(URI uri) {
        return WebSocketClientProtocolConfig.newBuilder()
            .webSocketUri(uri)
            .subprotocol(null)
            .build();
    }

    private SimpleChannelInboundHandler<WebSocketFrame> webSocketFrameHandler(String[] receivedMessage, CountDownLatch latch, String expectedMessage) {
        return new SimpleChannelInboundHandler<WebSocketFrame>() {
            @Override
            protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
                if (frame instanceof TextWebSocketFrame) {
                    receivedMessage[0] = ((TextWebSocketFrame) frame).text();
                    latch.countDown();
                }
            }

            @Override
            public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
                if (evt instanceof WebSocketClientProtocolHandler.ClientHandshakeStateEvent) {
                    if (evt == WebSocketClientProtocolHandler.ClientHandshakeStateEvent.HANDSHAKE_COMPLETE) {
                        // Handshake completed, now broadcast the message
                        WebSocketFrameHandler.broadcast(expectedMessage);
                    }
                }
            }
        };
    }
}
