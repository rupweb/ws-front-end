package backend;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.concurrent.CopyOnWriteArraySet;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<Object> {
    private static final Logger logger = LogManager.getLogger(WebSocketFrameHandler.class);
    private static final CopyOnWriteArraySet<Channel> channels = new CopyOnWriteArraySet<>();

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        channels.add(ctx.channel());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        channels.remove(ctx.channel());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof BinaryWebSocketFrame) {
            BinaryWebSocketFrame frame = (BinaryWebSocketFrame) msg;
            ByteBuf buffer = frame.content();
            byte[] data = new byte[buffer.readableBytes()];
            buffer.readBytes(data);
            // Handle incoming binary data (SBE encoded)
            logger.info("Received binary message");
            // Decode the message
            // Your decoding logic here

            // Example: Sending back an encoded response
            // ByteBuf encodedResponse = encodeResponse(data);
            // ctx.channel().writeAndFlush(new BinaryWebSocketFrame(encodedResponse));
        } else if (msg instanceof TextWebSocketFrame) {
            TextWebSocketFrame frame = (TextWebSocketFrame) msg;
            String request = frame.text();
            logger.info("Received message: {}", request);
            ctx.channel().writeAndFlush(new TextWebSocketFrame("Hello, " + request));
        } else {
            String message = "unsupported frame type: " + msg.getClass().getName();
            throw new UnsupportedOperationException(message);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        logger.error("WebSocket error: {}", cause.getMessage());
        ctx.close();
    }

    public static void broadcast(String message) {
        for (Channel channel : channels) {
            channel.writeAndFlush(new TextWebSocketFrame(message));
        }
    }

    public static void broadcast(byte[] data) {
        for (Channel channel : channels) {
            channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(data)));
        }
    }
}
