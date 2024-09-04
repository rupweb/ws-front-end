package backend;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import persistence.PersistenceQueue;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.concurrent.CopyOnWriteArraySet;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<WebSocketFrame> {
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
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        if (frame instanceof BinaryWebSocketFrame) {
            logger.debug("Received binary message");
            ByteBuf byteBuf = frame.content();
            byte[] data = new byte[byteBuf.readableBytes()];
            byteBuf.readBytes(data);
            App.getAeronClient().getBackendToFix().sendMessage(data);  // Publish binary data to Aeron multicast
        } else if (frame instanceof TextWebSocketFrame) {
            TextWebSocketFrame textFrame = (TextWebSocketFrame) frame;
            String request = textFrame.text();
            logger.info("Received message: {}", request);

            // Don't persist ping messages
            if (!request.contains("\"type\":\"ping\""))
                PersistenceQueue.getInstance().getQueue().offer(request);        

            ctx.channel().writeAndFlush(new TextWebSocketFrame("Echo: " + request));
        } else {
            String message = "unsupported frame type: " + frame.getClass().getName();
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
            logger.debug("Broadcast message: {}", message);
            channel.writeAndFlush(new TextWebSocketFrame(message));
        }
    }

    public static void broadcast(byte[] data) {
        for (Channel channel : channels) {
            logger.debug("Broadcast binary data");
            channel.writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(data)));
        }
    }
}
