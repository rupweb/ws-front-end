package backend;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import messaging.SbeDecoder;

public class WebSocketSbeDecoding extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {
    private static final Logger logger = LogManager.getLogger(WebSocketSbeDecoding.class);

    // Initialize the decoder
    SbeDecoder sbeDecoder = new SbeDecoder();

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        byte[] data = new byte[frame.content().readableBytes()];
        frame.content().readBytes(data);
        sbeDecoder.decode(data);
    }
}
