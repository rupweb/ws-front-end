/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona.messages;

import org.agrona.MutableDirectBuffer;


/**
 * Execution Report message
 */
@SuppressWarnings("all")
public final class ExecutionReportEncoder
{
    public static final int BLOCK_LENGTH = 146;
    public static final int TEMPLATE_ID = 2;
    public static final int SCHEMA_ID = 1;
    public static final int SCHEMA_VERSION = 1;
    public static final String SEMANTIC_VERSION = "";
    public static final java.nio.ByteOrder BYTE_ORDER = java.nio.ByteOrder.LITTLE_ENDIAN;

    private final ExecutionReportEncoder parentMessage = this;
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

    public ExecutionReportEncoder wrap(final MutableDirectBuffer buffer, final int offset)
    {
        if (buffer != this.buffer)
        {
            this.buffer = buffer;
        }
        this.offset = offset;
        limit(offset + BLOCK_LENGTH);

        return this;
    }

    public ExecutionReportEncoder wrapAndApplyHeader(
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


    public ExecutionReportEncoder currency(final int index, final byte value)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 17 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public ExecutionReportEncoder putCurrency(final byte value0, final byte value1, final byte value2)
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

    public ExecutionReportEncoder putCurrency(final byte[] src, final int srcOffset)
    {
        final int length = 3;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 17, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder currency(final String src)
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

    public static int secondaryAmountId()
    {
        return 3;
    }

    public static int secondaryAmountSinceVersion()
    {
        return 0;
    }

    public static int secondaryAmountEncodingOffset()
    {
        return 20;
    }

    public static int secondaryAmountEncodingLength()
    {
        return 9;
    }

    public static String secondaryAmountMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    private final DecimalEncoder secondaryAmount = new DecimalEncoder();

    /**
     * The secondary amount
     *
     * @return DecimalEncoder : The secondary amount
     */
    public DecimalEncoder secondaryAmount()
    {
        secondaryAmount.wrap(buffer, offset + 20);
        return secondaryAmount;
    }

    public static int secondaryCurrencyId()
    {
        return 4;
    }

    public static int secondaryCurrencySinceVersion()
    {
        return 0;
    }

    public static int secondaryCurrencyEncodingOffset()
    {
        return 29;
    }

    public static int secondaryCurrencyEncodingLength()
    {
        return 3;
    }

    public static String secondaryCurrencyMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte secondaryCurrencyNullValue()
    {
        return (byte)0;
    }

    public static byte secondaryCurrencyMinValue()
    {
        return (byte)32;
    }

    public static byte secondaryCurrencyMaxValue()
    {
        return (byte)126;
    }

    public static int secondaryCurrencyLength()
    {
        return 3;
    }


    public ExecutionReportEncoder secondaryCurrency(final int index, final byte value)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 29 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public ExecutionReportEncoder putSecondaryCurrency(final byte value0, final byte value1, final byte value2)
    {
        buffer.putByte(offset + 29, value0);
        buffer.putByte(offset + 30, value1);
        buffer.putByte(offset + 31, value2);

        return this;
    }

    public static String secondaryCurrencyCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putSecondaryCurrency(final byte[] src, final int srcOffset)
    {
        final int length = 3;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 29, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder secondaryCurrency(final String src)
    {
        final int length = 3;
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
        return 32;
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


    public ExecutionReportEncoder side(final int index, final byte value)
    {
        if (index < 0 || index >= 4)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 32 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }
    public ExecutionReportEncoder putSide(final byte value0, final byte value1, final byte value2, final byte value3)
    {
        buffer.putByte(offset + 32, value0);
        buffer.putByte(offset + 33, value1);
        buffer.putByte(offset + 34, value2);
        buffer.putByte(offset + 35, value3);

        return this;
    }

    public static String sideCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putSide(final byte[] src, final int srcOffset)
    {
        final int length = 4;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 32, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder side(final String src)
    {
        final int length = 4;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 32, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 32 + start, (byte)0);
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
        return 36;
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


    public ExecutionReportEncoder symbol(final int index, final byte value)
    {
        if (index < 0 || index >= 6)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 36 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String symbolCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putSymbol(final byte[] src, final int srcOffset)
    {
        final int length = 6;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 36, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder symbol(final String src)
    {
        final int length = 6;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 36, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 36 + start, (byte)0);
        }

        return this;
    }

    public static int deliveryDateId()
    {
        return 7;
    }

    public static int deliveryDateSinceVersion()
    {
        return 0;
    }

    public static int deliveryDateEncodingOffset()
    {
        return 42;
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


    public ExecutionReportEncoder deliveryDate(final int index, final byte value)
    {
        if (index < 0 || index >= 8)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 42 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String deliveryDateCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putDeliveryDate(final byte[] src, final int srcOffset)
    {
        final int length = 8;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 42, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder deliveryDate(final String src)
    {
        final int length = 8;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 42, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 42 + start, (byte)0);
        }

        return this;
    }

    public static int transactTimeId()
    {
        return 8;
    }

    public static int transactTimeSinceVersion()
    {
        return 0;
    }

    public static int transactTimeEncodingOffset()
    {
        return 50;
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


    public ExecutionReportEncoder transactTime(final int index, final byte value)
    {
        if (index < 0 || index >= 21)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 50 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String transactTimeCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putTransactTime(final byte[] src, final int srcOffset)
    {
        final int length = 21;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 50, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder transactTime(final String src)
    {
        final int length = 21;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 50, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 50 + start, (byte)0);
        }

        return this;
    }

    public static int quoteRequestIDId()
    {
        return 9;
    }

    public static int quoteRequestIDSinceVersion()
    {
        return 0;
    }

    public static int quoteRequestIDEncodingOffset()
    {
        return 71;
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


    public ExecutionReportEncoder quoteRequestID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 71 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putQuoteRequestID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 71, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder quoteRequestID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 71, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 71 + start, (byte)0);
        }

        return this;
    }

    public static int quoteIDId()
    {
        return 10;
    }

    public static int quoteIDSinceVersion()
    {
        return 0;
    }

    public static int quoteIDEncodingOffset()
    {
        return 87;
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


    public ExecutionReportEncoder quoteID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 87 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String quoteIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putQuoteID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 87, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder quoteID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 87, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 87 + start, (byte)0);
        }

        return this;
    }

    public static int dealRequestIDId()
    {
        return 11;
    }

    public static int dealRequestIDSinceVersion()
    {
        return 0;
    }

    public static int dealRequestIDEncodingOffset()
    {
        return 103;
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


    public ExecutionReportEncoder dealRequestID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 103 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String dealRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putDealRequestID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 103, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder dealRequestID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 103, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 103 + start, (byte)0);
        }

        return this;
    }

    public static int dealIDId()
    {
        return 12;
    }

    public static int dealIDSinceVersion()
    {
        return 0;
    }

    public static int dealIDEncodingOffset()
    {
        return 119;
    }

    public static int dealIDEncodingLength()
    {
        return 16;
    }

    public static String dealIDMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte dealIDNullValue()
    {
        return (byte)0;
    }

    public static byte dealIDMinValue()
    {
        return (byte)32;
    }

    public static byte dealIDMaxValue()
    {
        return (byte)126;
    }

    public static int dealIDLength()
    {
        return 16;
    }


    public ExecutionReportEncoder dealID(final int index, final byte value)
    {
        if (index < 0 || index >= 16)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 119 + (index * 1);
        buffer.putByte(pos, value);

        return this;
    }

    public static String dealIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public ExecutionReportEncoder putDealID(final byte[] src, final int srcOffset)
    {
        final int length = 16;
        if (srcOffset < 0 || srcOffset > (src.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + srcOffset);
        }

        buffer.putBytes(offset + 119, src, srcOffset, length);

        return this;
    }

    public ExecutionReportEncoder dealID(final String src)
    {
        final int length = 16;
        final byte[] bytes = (null == src || src.isEmpty()) ? org.agrona.collections.ArrayUtil.EMPTY_BYTE_ARRAY : src.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        if (bytes.length > length)
        {
            throw new IndexOutOfBoundsException("String too large for copy: byte length=" + bytes.length);
        }

        buffer.putBytes(offset + 119, bytes, 0, bytes.length);

        for (int start = bytes.length; start < length; ++start)
        {
            buffer.putByte(offset + 119 + start, (byte)0);
        }

        return this;
    }

    public static int fxRateId()
    {
        return 13;
    }

    public static int fxRateSinceVersion()
    {
        return 0;
    }

    public static int fxRateEncodingOffset()
    {
        return 135;
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
        fxRate.wrap(buffer, offset + 135);
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

        final ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(buffer, offset, BLOCK_LENGTH, SCHEMA_VERSION);

        return decoder.appendTo(builder);
    }
}
