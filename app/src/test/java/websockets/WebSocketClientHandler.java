package websockets;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.util.concurrent.Promise;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class WebSocketClientHandler extends SimpleChannelInboundHandler<WebSocketFrame> {
    private static final Logger log = LogManager.getLogger(WebSocketClientHandler.class);

    private ChannelPromise handshakeFuture;
    private Promise<String> responsePromise;
    private Promise<byte[]> binaryResponsePromise;

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        log.info("Handler added, initializing promises");
        handshakeFuture = ctx.newPromise();
        responsePromise = ctx.executor().newPromise();
        binaryResponsePromise = ctx.executor().newPromise(); // New promise for binary data
    }

    public ChannelFuture handshakeFuture() {
        return handshakeFuture;
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, WebSocketFrame frame) {
        if (frame instanceof TextWebSocketFrame textFrame) {
            responsePromise.setSuccess(textFrame.text());
        } else if (frame instanceof BinaryWebSocketFrame binaryFrame) {
            log.info("Binary frame received");
            ByteBuf byteBuf = binaryFrame.content();
            byte[] data = new byte[byteBuf.readableBytes()];
            byteBuf.readBytes(data);
            binaryResponsePromise.setSuccess(data); // Set the binary data in the promise
        } else if (frame instanceof PongWebSocketFrame) {
            log.info("Pong received");
        } else if (frame instanceof CloseWebSocketFrame) {
            ctx.close();
        }
    }

    public void sendMessage(String message) {
        handshakeFuture.channel().writeAndFlush(new TextWebSocketFrame(message));
    }

    public void sendBinaryMessage(byte[] data) {
        handshakeFuture.channel().writeAndFlush(new BinaryWebSocketFrame(Unpooled.wrappedBuffer(data)));
    }

    public String getResponse() throws InterruptedException {
        return responsePromise.sync().getNow();
    }

    public byte[] getBinaryResponse() throws InterruptedException {
        return binaryResponsePromise.sync().getNow(); // Wait and retrieve the binary response
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("Exception caught: {}", cause.getMessage());
        ctx.close();
    }
}
