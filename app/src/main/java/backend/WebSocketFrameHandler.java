package backend;

import java.util.concurrent.CopyOnWriteArraySet;

import org.agrona.concurrent.UnsafeBuffer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import app.App;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

public class WebSocketFrameHandler extends SimpleChannelInboundHandler<WebSocketFrame> {
    private static final Logger logger = LogManager.getLogger(WebSocketFrameHandler.class);
    private static final CopyOnWriteArraySet<Channel> channels = new CopyOnWriteArraySet<>();

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        channels.add(ctx.channel());
        logger.info("Client connected: {}", ctx.channel().remoteAddress());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        channels.remove(ctx.channel());
        logger.info("Client disconnected: {}", ctx.channel().remoteAddress());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        if (frame instanceof BinaryWebSocketFrame binaryFrame) {
            logger.debug("Received binary message");
        
            ByteBuf byteBuf = binaryFrame.content();
    
            // Don't advance reader index – just get raw buffer
            int offset = byteBuf.readerIndex();
            int length = byteBuf.readableBytes();
    
            byte[] data = new byte[length];
            byteBuf.getBytes(offset, data);  // don't use readBytes
    
            UnsafeBuffer buffer = new UnsafeBuffer(data);
    
            // Pass in offset = 0, length = data.length
            App.getAeronClient().getSender().send(buffer, 0, data.length, "");
        } else if (frame instanceof TextWebSocketFrame textFrame) {
            String request = textFrame.text();
            logger.debug("Received message: {}", request);     
            ctx.channel().writeAndFlush(new TextWebSocketFrame("Echo: " + request));
        } else {
            String message = "unsupported frame type: " + frame.getClass().getName();
            throw new UnsupportedOperationException(message);
        }
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof WebSocketServerProtocolHandler.HandshakeComplete handshake) {
            String requestUri = handshake.requestUri();
            logger.info("WebSocket handshake complete. Full path: {}", requestUri);
        } else {
            super.userEventTriggered(ctx, evt);
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
