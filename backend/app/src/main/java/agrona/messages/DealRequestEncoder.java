/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona.messages;

import org.agrona.MutableDirectBuffer;


/**
 * Deal Request message
 */
@SuppressWarnings("all")
public final class DealRequestEncoder
{
    public static final int BLOCK_LENGTH = 118;
    public static final int TEMPLATE_ID = 1;
    public static final int SCHEMA_ID = 1;
    public static final int SCHEMA_VERSION = 1;
    public static final String SEMANTIC_VERSION = "";
    public static final java.nio.ByteOrder BYTE_ORDER = java.nio.ByteOrder.LITTLE_ENDIAN;

    private final DealRequestEncoder parentMessage = this;
    private MutableDirectBuffer buffer;
    private int offset;
    private int limit;

    public int sbeBlockLength()
    {
        return BLOCK_LENGTH;
    }

    public int sbeTemplateId()
    {
        return TEMPLATE_ID;
    }

    public int sbeSchemaId()
    {
        return SCHEMA_ID;
    }

    public int sbeSchemaVersion()
    {
        return SCHEMA_VERSION;
    }

    public String sbeSemanticType()
    {
        return "";
    }

    public MutableDirectBuffer buffer()
    {
        return buffer;
    }

    public int offset()
    {
        return offset;
    }

    public DealRequestEncoder wrap(final MutableDirectBuffer buffer, final int offset)
    {
        if (buffer != this.buffer)
        {
            this.buffer = buffer;
        }
        this.offset = offset;
        limit(offset + BLOCK_LENGTH);

        return this;
    }

    public DealRequestEncoder wrapAndApplyHeader(
        final MutableDirectBuffer buffer, final int offset, final MessageHeaderEncoder headerEncoder)
    {
        headerEncoder
            .wrap(buffer, offset)
            .blockLength(BLOCK_LENGTH)
            .templateId(TEMPLATE_ID)
            .schemaId(SCHEMA_ID)
            .version(SCHEMA_VERSION);

        return wrap(buffer, offset + MessageHeaderEncoder.ENCODED_LENGTH);
    }

    public int encodedLength()
    {
        return limit - offset;
    }

    public int limit()
    {
        return limit;
    }

    public void limit(final int limit)
    {
        this.limit = limit;
    }

    public static int headerId()
    {
        return 0;
    }

    public static int headerSinceVersion()
    {
        return 0;
    }

    public static int headerEncodingOffset()
    {
        return 0;
    }

    public static int headerEncodingLength()
    {
        return 8;
    }

    public static String headerMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    private final MessageHeaderEncoder header = new MessageHeaderEncoder();

    /**
     * Standard message header
     *
     * @return MessageHeaderEncoder : Standard message header
     */
    public MessageHeaderEncoder header()
    {
        header.wrap(buffer, offset + 0);
        return header;
    }

    public static int amountId()
    {
        return 1;
    }

    public static int amountSinceVersion()
    {
        return 0;
    }

    public static int amountEncodingOffset()
    {
        return 8;
    }

    public static int amountEncodingLength()
    {
        return 9;
    }

    public static String amountMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    private final DecimalEncoder amount = new DecimalEncoder();

    /**
     * The deal amount
     *
     * @return DecimalEncoder : The deal amount
     */
    public DecimalEncoder amount()
    {
        amount.wrap(buffer, offset + 8);
        return amount;
    }

    public static int currencyId()
    {
        return 2;
    }

    public static int currencySinceVersion()
    {
        return 0;
    }

    public static int currencyEncodingOffset()
    {
        return 17;
    }

    public static int currencyEncodingLength()
    {
        return 3;
    }

    public static String currencyMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte currencyNullValue()
    {
        return (byte)0;
    }

    public static byte currencyMinValue()
    {
        return (byte)32;
    }

    public static byte currencyMaxValue()
    {
        return (byte)126;
    }

    public static int currencyLength()
    {
        return 3;
    }


    public DealRequestEncoder currency(final int index, final byte value)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 17 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public DealRequestEncoder putCurrency(final byte value0, final byte value1, final byte value2)
    {
        buffer.putByte(offset + 17, value0);
        buffer.putByte(offset + 18, value1);
        buffer.putByte(offset + 19, value2);

        return this;
    }

    public static String currencyCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putCurrency(final byte[] src, final int srcOffset)
    {
        final int length = 3;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 17, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder currency(final String src)
    {
        final int length = 3;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 17, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 17 + start, (byte)0);
        }

        return this;
    }

    public static int sideId()
    {
        return 3;
    }

    public static int sideSinceVersion()
    {
        return 0;
    }

    public static int sideEncodingOffset()
    {
        return 20;
    }

    public static int sideEncodingLength()
    {
        return 4;
    }

    public static String sideMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte sideNullValue()
    {
        return (byte)0;
    }

    public static byte sideMinValue()
    {
        return (byte)32;
    }

    public static byte sideMaxValue()
    {
        return (byte)126;
    }

    public static int sideLength()
    {
        return 4;
    }


    public DealRequestEncoder side(final int index, final byte value)
    {
        if (index < 0 || index >= 4)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 20 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public DealRequestEncoder putSide(final byte value0, final byte value1, final byte value2, final byte value3)
    {
        buffer.putByte(offset + 20, value0);
        buffer.putByte(offset + 21, value1);
        buffer.putByte(offset + 22, value2);
        buffer.putByte(offset + 23, value3);

        return this;
    }

    public static String sideCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putSide(final byte[] src, final int srcOffset)
    {
        final int length = 4;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 20, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder side(final String src)
    {
        final int length = 4;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 20, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 20 + start, (byte)0);
        }

        return this;
    }

    public static int symbolId()
    {
        return 4;
    }

    public static int symbolSinceVersion()
    {
        return 0;
    }

    public static int symbolEncodingOffset()
    {
        return 24;
    }

    public static int symbolEncodingLength()
    {
        return 6;
    }

    public static String symbolMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte symbolNullValue()
    {
        return (byte)0;
    }

    public static byte symbolMinValue()
    {
        return (byte)32;
    }

    public static byte symbolMaxValue()
    {
        return (byte)126;
    }

    public static int symbolLength()
    {
        return 6;
    }


    public DealRequestEncoder symbol(final int index, final byte value)
    {
        if (index < 0 || index >= 6)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 24 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String symbolCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putSymbol(final byte[] src, final int srcOffset)
    {
        final int length = 6;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 24, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder symbol(final String src)
    {
        final int length = 6;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 24, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 24 + start, (byte)0);
        }

        return this;
    }

    public static int deliveryDateId()
    {
        return 5;
    }

    public static int deliveryDateSinceVersion()
    {
        return 0;
    }

    public static int deliveryDateEncodingOffset()
    {
        return 30;
    }

    public static int deliveryDateEncodingLength()
    {
        return 8;
    }

    public static String deliveryDateMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte deliveryDateNullValue()
    {
        return (byte)0;
    }

    public static byte deliveryDateMinValue()
    {
        return (byte)32;
    }

    public static byte deliveryDateMaxValue()
    {
        return (byte)126;
    }

    public static int deliveryDateLength()
    {
        return 8;
    }


    public DealRequestEncoder deliveryDate(final int index, final byte value)
    {
        if (index < 0 || index >= 8)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 30 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String deliveryDateCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putDeliveryDate(final byte[] src, final int srcOffset)
    {
        final int length = 8;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 30, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder deliveryDate(final String src)
    {
        final int length = 8;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 30, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 30 + start, (byte)0);
        }

        return this;
    }

    public static int transactTimeId()
    {
        return 6;
    }

    public static int transactTimeSinceVersion()
    {
        return 0;
    }

    public static int transactTimeEncodingOffset()
    {
        return 38;
    }

    public static int transactTimeEncodingLength()
    {
        return 21;
    }

    public static String transactTimeMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte transactTimeNullValue()
    {
        return (byte)0;
    }

    public static byte transactTimeMinValue()
    {
        return (byte)32;
    }

    public static byte transactTimeMaxValue()
    {
        return (byte)126;
    }

    public static int transactTimeLength()
    {
        return 21;
    }


    public DealRequestEncoder transactTime(final int index, final byte value)
    {
        if (index < 0 || index >= 21)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 38 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String transactTimeCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putTransactTime(final byte[] src, final int srcOffset)
    {
        final int length = 21;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 38, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder transactTime(final String src)
    {
        final int length = 21;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 38, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 38 + start, (byte)0);
        }

        return this;
    }

    public static int quoteRequestIDId()
    {
        return 7;
    }

    public static int quoteRequestIDSinceVersion()
    {
        return 0;
    }

    public static int quoteRequestIDEncodingOffset()
    {
        return 59;
    }

    public static int quoteRequestIDEncodingLength()
    {
        return 16;
    }

    public static String quoteRequestIDMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte quoteRequestIDNullValue()
    {
        return (byte)0;
    }

    public static byte quoteRequestIDMinValue()
    {
        return (byte)32;
    }

    public static byte quoteRequestIDMaxValue()
    {
        return (byte)126;
    }

    public static int quoteRequestIDLength()
    {
        return 16;
    }


    public DealRequestEncoder quoteRequestID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 59 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putQuoteRequestID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 59, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder quoteRequestID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 59, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 59 + start, (byte)0);
        }

        return this;
    }

    public static int quoteIDId()
    {
        return 8;
    }

    public static int quoteIDSinceVersion()
    {
        return 0;
    }

    public static int quoteIDEncodingOffset()
    {
        return 75;
    }

    public static int quoteIDEncodingLength()
    {
        return 16;
    }

    public static String quoteIDMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte quoteIDNullValue()
    {
        return (byte)0;
    }

    public static byte quoteIDMinValue()
    {
        return (byte)32;
    }

    public static byte quoteIDMaxValue()
    {
        return (byte)126;
    }

    public static int quoteIDLength()
    {
        return 16;
    }


    public DealRequestEncoder quoteID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 75 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putQuoteID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 75, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder quoteID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 75, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 75 + start, (byte)0);
        }

        return this;
    }

    public static int dealRequestIDId()
    {
        return 9;
    }

    public static int dealRequestIDSinceVersion()
    {
        return 0;
    }

    public static int dealRequestIDEncodingOffset()
    {
        return 91;
    }

    public static int dealRequestIDEncodingLength()
    {
        return 16;
    }

    public static String dealRequestIDMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte dealRequestIDNullValue()
    {
        return (byte)0;
    }

    public static byte dealRequestIDMinValue()
    {
        return (byte)32;
    }

    public static byte dealRequestIDMaxValue()
    {
        return (byte)126;
    }

    public static int dealRequestIDLength()
    {
        return 16;
    }


    public DealRequestEncoder dealRequestID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 91 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String dealRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public DealRequestEncoder putDealRequestID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 91, src, srcOffset, length);

        return this;
    }

    public DealRequestEncoder dealRequestID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 91, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 91 + start, (byte)0);
        }

        return this;
    }

    public static int fxRateId()
    {
        return 10;
    }

    public static int fxRateSinceVersion()
    {
        return 0;
    }

    public static int fxRateEncodingOffset()
    {
        return 107;
    }

    public static int fxRateEncodingLength()
    {
        return 9;
    }

    public static String fxRateMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    private final DecimalEncoder fxRate = new DecimalEncoder();

    /**
     * The FX rate
     *
     * @return DecimalEncoder : The FX rate
     */
    public DecimalEncoder fxRate()
    {
        fxRate.wrap(buffer, offset + 107);
        return fxRate;
    }

    public String toString()
    {
        if (null == buffer)
        {
            return "";
        }

        return appendTo(new StringBuilder()).toString();
    }

    public StringBuilder appendTo(final StringBuilder builder)
    {
        if (null == buffer)
        {
            return builder;
        }

        final DealRequestDecoder decoder = new DealRequestDecoder();
        decoder.wrap(buffer, offset, BLOCK_LENGTH, SCHEMA_VERSION);

        return decoder.appendTo(builder);
    }
}
