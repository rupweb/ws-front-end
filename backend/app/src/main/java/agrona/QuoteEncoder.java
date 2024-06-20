/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona;

import org.agrona.MutableDirectBuffer;


/**
 * Quote message
 */
@SuppressWarnings("all")
public final class QuoteEncoder
{
    public static final int BLOCK_LENGTH = 192;
    public static final int TEMPLATE_ID = 4;
    public static final int SCHEMA_ID = 1;
    public static final int SCHEMA_VERSION = 1;
    public static final String SEMANTIC_VERSION = "";
    public static final java.nio.ByteOrder BYTE_ORDER = java.nio.ByteOrder.LITTLE_ENDIAN;

    private final QuoteEncoder parentMessage = this;
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

    public QuoteEncoder wrap(final MutableDirectBuffer buffer, final int offset)
    {
        if (buffer != this.buffer)
        {
            this.buffer = buffer;
        }
        this.offset = offset;
        limit(offset + BLOCK_LENGTH);

        return this;
    }

    public QuoteEncoder wrapAndApplyHeader(
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
     * The amount
     *
     * @return DecimalEncoder : The amount
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


    public QuoteEncoder currency(final int index, final byte value)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 17 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public QuoteEncoder putCurrency(final byte value0, final byte value1, final byte value2)
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

    public QuoteEncoder putCurrency(final byte[] src, final int srcOffset)
    {
        final int length = 3;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 17, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder currency(final String src)
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

    public static int fxRateId()
    {
        return 3;
    }

    public static int fxRateSinceVersion()
    {
        return 0;
    }

    public static int fxRateEncodingOffset()
    {
        return 20;
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
        fxRate.wrap(buffer, offset + 20);
        return fxRate;
    }

    public static int transactTimeId()
    {
        return 4;
    }

    public static int transactTimeSinceVersion()
    {
        return 0;
    }

    public static int transactTimeEncodingOffset()
    {
        return 29;
    }

    public static int transactTimeEncodingLength()
    {
        return 19;
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
        return 19;
    }


    public QuoteEncoder transactTime(final int index, final byte value)
    {
        if (index < 0 || index >= 19)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 29 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String transactTimeCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public QuoteEncoder putTransactTime(final byte[] src, final int srcOffset)
    {
        final int length = 19;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 29, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder transactTime(final String src)
    {
        final int length = 19;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 29, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 29 + start, (byte)0);
        }

        return this;
    }

    public static int sideId()
    {
        return 5;
    }

    public static int sideSinceVersion()
    {
        return 0;
    }

    public static int sideEncodingOffset()
    {
        return 48;
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


    public QuoteEncoder side(final int index, final byte value)
    {
        if (index < 0 || index >= 4)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 48 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public QuoteEncoder putSide(final byte value0, final byte value1, final byte value2, final byte value3)
    {
        buffer.putByte(offset + 48, value0);
        buffer.putByte(offset + 49, value1);
        buffer.putByte(offset + 50, value2);
        buffer.putByte(offset + 51, value3);

        return this;
    }

    public static String sideCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public QuoteEncoder putSide(final byte[] src, final int srcOffset)
    {
        final int length = 4;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 48, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder side(final String src)
    {
        final int length = 4;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 48, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 48 + start, (byte)0);
        }

        return this;
    }

    public static int symbolId()
    {
        return 6;
    }

    public static int symbolSinceVersion()
    {
        return 0;
    }

    public static int symbolEncodingOffset()
    {
        return 52;
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


    public QuoteEncoder symbol(final int index, final byte value)
    {
        if (index < 0 || index >= 6)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 52 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String symbolCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public QuoteEncoder putSymbol(final byte[] src, final int srcOffset)
    {
        final int length = 6;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 52, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder symbol(final String src)
    {
        final int length = 6;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 52, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 52 + start, (byte)0);
        }

        return this;
    }

    public static int quoteIDId()
    {
        return 7;
    }

    public static int quoteIDSinceVersion()
    {
        return 0;
    }

    public static int quoteIDEncodingOffset()
    {
        return 58;
    }

    public static int quoteIDEncodingLength()
    {
        return 36;
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
        return 36;
    }


    public QuoteEncoder quoteID(final int index, final byte value)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 58 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public QuoteEncoder putQuoteID(final byte[] src, final int srcOffset)
    {
        final int length = 36;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 58, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder quoteID(final String src)
    {
        final int length = 36;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 58, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 58 + start, (byte)0);
        }

        return this;
    }

    public static int quoteRequestIDId()
    {
        return 8;
    }

    public static int quoteRequestIDSinceVersion()
    {
        return 0;
    }

    public static int quoteRequestIDEncodingOffset()
    {
        return 94;
    }

    public static int quoteRequestIDEncodingLength()
    {
        return 36;
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
        return 36;
    }


    public QuoteEncoder quoteRequestID(final int index, final byte value)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 94 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public QuoteEncoder putQuoteRequestID(final byte[] src, final int srcOffset)
    {
        final int length = 36;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 94, src, srcOffset, length);

        return this;
    }

    public QuoteEncoder quoteRequestID(final String src)
    {
        final int length = 36;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 94, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 94 + start, (byte)0);
        }

        return this;
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

        final QuoteDecoder decoder = new QuoteDecoder();
        decoder.wrap(buffer, offset, BLOCK_LENGTH, SCHEMA_VERSION);

        return decoder.appendTo(builder);
    }
}
