/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona.messages;

import org.agrona.DirectBuffer;


/**
 * Execution Report message
 */
@SuppressWarnings("all")
public final class ExecutionReportDecoder
{
    public static final int BLOCK_LENGTH = 290;
    public static final int TEMPLATE_ID = 2;
    public static final int SCHEMA_ID = 1;
    public static final int SCHEMA_VERSION = 1;
    public static final String SEMANTIC_VERSION = "";
    public static final java.nio.ByteOrder BYTE_ORDER = java.nio.ByteOrder.LITTLE_ENDIAN;

    private final ExecutionReportDecoder parentMessage = this;
    private DirectBuffer buffer;
    private int offset;
    private int limit;
    int actingBlockLength;
    int actingVersion;

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

    public DirectBuffer buffer()
    {
        return buffer;
    }

    public int offset()
    {
        return offset;
    }

    public ExecutionReportDecoder wrap(
        final DirectBuffer buffer,
        final int offset,
        final int actingBlockLength,
        final int actingVersion)
    {
        if (buffer != this.buffer)
        {
            this.buffer = buffer;
        }
        this.offset = offset;
        this.actingBlockLength = actingBlockLength;
        this.actingVersion = actingVersion;
        limit(offset + actingBlockLength);

        return this;
    }

    public ExecutionReportDecoder wrapAndApplyHeader(
        final DirectBuffer buffer,
        final int offset,
        final MessageHeaderDecoder headerDecoder)
    {
        headerDecoder.wrap(buffer, offset);

        final int templateId = headerDecoder.templateId();
        if (TEMPLATE_ID != templateId)
        {
            throw new IllegalStateException("Invalid TEMPLATE_ID: " + templateId);
        }

        return wrap(
            buffer,
            offset + MessageHeaderDecoder.ENCODED_LENGTH,
            headerDecoder.blockLength(),
            headerDecoder.version());
    }

    public ExecutionReportDecoder sbeRewind()
    {
        return wrap(buffer, offset, actingBlockLength, actingVersion);
    }

    public int sbeDecodedLength()
    {
        final int currentLimit = limit();
        sbeSkip();
        final int decodedLength = encodedLength();
        limit(currentLimit);

        return decodedLength;
    }

    public int actingVersion()
    {
        return actingVersion;
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

    private final MessageHeaderDecoder header = new MessageHeaderDecoder();

    /**
     * Standard message header
     *
     * @return MessageHeaderDecoder : Standard message header
     */
    public MessageHeaderDecoder header()
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

    private final DecimalDecoder amount = new DecimalDecoder();

    /**
     * The amount
     *
     * @return DecimalDecoder : The amount
     */
    public DecimalDecoder amount()
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


    public byte currency(final int index)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 17 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String currencyCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getCurrency(final byte[] dst, final int dstOffset)
    {
        final int length = 3;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 17, dst, dstOffset, length);

        return length;
    }

    public String currency()
    {
        final byte[] dst = new byte[3];
        buffer.getBytes(offset + 17, dst, 0, 3);

        int end = 0;
        for (; end < 3 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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

    private final DecimalDecoder secondaryAmount = new DecimalDecoder();

    /**
     * The secondary amount
     *
     * @return DecimalDecoder : The secondary amount
     */
    public DecimalDecoder secondaryAmount()
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


    public byte secondaryCurrency(final int index)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 29 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String secondaryCurrencyCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getSecondaryCurrency(final byte[] dst, final int dstOffset)
    {
        final int length = 3;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 29, dst, dstOffset, length);

        return length;
    }

    public String secondaryCurrency()
    {
        final byte[] dst = new byte[3];
        buffer.getBytes(offset + 29, dst, 0, 3);

        int end = 0;
        for (; end < 3 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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


    public byte side(final int index)
    {
        if (index < 0 || index >= 4)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 32 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String sideCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getSide(final byte[] dst, final int dstOffset)
    {
        final int length = 4;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 32, dst, dstOffset, length);

        return length;
    }

    public String side()
    {
        final byte[] dst = new byte[4];
        buffer.getBytes(offset + 32, dst, 0, 4);

        int end = 0;
        for (; end < 4 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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


    public byte symbol(final int index)
    {
        if (index < 0 || index >= 6)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 36 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String symbolCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getSymbol(final byte[] dst, final int dstOffset)
    {
        final int length = 6;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 36, dst, dstOffset, length);

        return length;
    }

    public String symbol()
    {
        final byte[] dst = new byte[6];
        buffer.getBytes(offset + 36, dst, 0, 6);

        int end = 0;
        for (; end < 6 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 10;
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
        return 10;
    }


    public byte deliveryDate(final int index)
    {
        if (index < 0 || index >= 10)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 42 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String deliveryDateCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getDeliveryDate(final byte[] dst, final int dstOffset)
    {
        final int length = 10;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 42, dst, dstOffset, length);

        return length;
    }

    public String deliveryDate()
    {
        final byte[] dst = new byte[10];
        buffer.getBytes(offset + 42, dst, 0, 10);

        int end = 0;
        for (; end < 10 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 52;
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


    public byte transactTime(final int index)
    {
        if (index < 0 || index >= 21)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 52 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String transactTimeCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getTransactTime(final byte[] dst, final int dstOffset)
    {
        final int length = 21;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 52, dst, dstOffset, length);

        return length;
    }

    public String transactTime()
    {
        final byte[] dst = new byte[21];
        buffer.getBytes(offset + 52, dst, 0, 21);

        int end = 0;
        for (; end < 21 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 73;
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


    public byte quoteRequestID(final int index)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 73 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String quoteRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getQuoteRequestID(final byte[] dst, final int dstOffset)
    {
        final int length = 36;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 73, dst, dstOffset, length);

        return length;
    }

    public String quoteRequestID()
    {
        final byte[] dst = new byte[36];
        buffer.getBytes(offset + 73, dst, 0, 36);

        int end = 0;
        for (; end < 36 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 109;
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


    public byte quoteID(final int index)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 109 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String quoteIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getQuoteID(final byte[] dst, final int dstOffset)
    {
        final int length = 36;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 109, dst, dstOffset, length);

        return length;
    }

    public String quoteID()
    {
        final byte[] dst = new byte[36];
        buffer.getBytes(offset + 109, dst, 0, 36);

        int end = 0;
        for (; end < 36 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 145;
    }

    public static int dealRequestIDEncodingLength()
    {
        return 36;
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
        return 36;
    }


    public byte dealRequestID(final int index)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 145 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String dealRequestIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getDealRequestID(final byte[] dst, final int dstOffset)
    {
        final int length = 36;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 145, dst, dstOffset, length);

        return length;
    }

    public String dealRequestID()
    {
        final byte[] dst = new byte[36];
        buffer.getBytes(offset + 145, dst, 0, 36);

        int end = 0;
        for (; end < 36 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 181;
    }

    public static int dealIDEncodingLength()
    {
        return 36;
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
        return 36;
    }


    public byte dealID(final int index)
    {
        if (index < 0 || index >= 36)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 181 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String dealIDCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getDealID(final byte[] dst, final int dstOffset)
    {
        final int length = 36;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 181, dst, dstOffset, length);

        return length;
    }

    public String dealID()
    {
        final byte[] dst = new byte[36];
        buffer.getBytes(offset + 181, dst, 0, 36);

        int end = 0;
        for (; end < 36 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 217;
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

    private final DecimalDecoder fxRate = new DecimalDecoder();

    /**
     * The FX rate
     *
     * @return DecimalDecoder : The FX rate
     */
    public DecimalDecoder fxRate()
    {
        fxRate.wrap(buffer, offset + 217);
        return fxRate;
    }

    public String toString()
    {
        if (null == buffer)
        {
            return "";
        }

        final ExecutionReportDecoder decoder = new ExecutionReportDecoder();
        decoder.wrap(buffer, offset, actingBlockLength, actingVersion);

        return decoder.appendTo(new StringBuilder()).toString();
    }

    public StringBuilder appendTo(final StringBuilder builder)
    {
        if (null == buffer)
        {
            return builder;
        }

        final int originalLimit = limit();
        limit(offset + actingBlockLength);
        builder.append("[ExecutionReport](sbeTemplateId=");
        builder.append(TEMPLATE_ID);
        builder.append("|sbeSchemaId=");
        builder.append(SCHEMA_ID);
        builder.append("|sbeSchemaVersion=");
        if (parentMessage.actingVersion != SCHEMA_VERSION)
        {
            builder.append(parentMessage.actingVersion);
            builder.append('/');
        }
        builder.append(SCHEMA_VERSION);
        builder.append("|sbeBlockLength=");
        if (actingBlockLength != BLOCK_LENGTH)
        {
            builder.append(actingBlockLength);
            builder.append('/');
        }
        builder.append(BLOCK_LENGTH);
        builder.append("):");
        builder.append("header=");
        final MessageHeaderDecoder header = this.header();
        if (null != header)
        {
            header.appendTo(builder);
        }
        else
        {
            builder.append("null");
        }
        builder.append('|');
        builder.append("amount=");
        final DecimalDecoder amount = this.amount();
        if (null != amount)
        {
            amount.appendTo(builder);
        }
        else
        {
            builder.append("null");
        }
        builder.append('|');
        builder.append("currency=");
        for (int i = 0; i < currencyLength() && this.currency(i) > 0; i++)
        {
            builder.append((char)this.currency(i));
        }
        builder.append('|');
        builder.append("secondaryAmount=");
        final DecimalDecoder secondaryAmount = this.secondaryAmount();
        if (null != secondaryAmount)
        {
            secondaryAmount.appendTo(builder);
        }
        else
        {
            builder.append("null");
        }
        builder.append('|');
        builder.append("secondaryCurrency=");
        for (int i = 0; i < secondaryCurrencyLength() && this.secondaryCurrency(i) > 0; i++)
        {
            builder.append((char)this.secondaryCurrency(i));
        }
        builder.append('|');
        builder.append("side=");
        for (int i = 0; i < sideLength() && this.side(i) > 0; i++)
        {
            builder.append((char)this.side(i));
        }
        builder.append('|');
        builder.append("symbol=");
        for (int i = 0; i < symbolLength() && this.symbol(i) > 0; i++)
        {
            builder.append((char)this.symbol(i));
        }
        builder.append('|');
        builder.append("deliveryDate=");
        for (int i = 0; i < deliveryDateLength() && this.deliveryDate(i) > 0; i++)
        {
            builder.append((char)this.deliveryDate(i));
        }
        builder.append('|');
        builder.append("transactTime=");
        for (int i = 0; i < transactTimeLength() && this.transactTime(i) > 0; i++)
        {
            builder.append((char)this.transactTime(i));
        }
        builder.append('|');
        builder.append("quoteRequestID=");
        for (int i = 0; i < quoteRequestIDLength() && this.quoteRequestID(i) > 0; i++)
        {
            builder.append((char)this.quoteRequestID(i));
        }
        builder.append('|');
        builder.append("quoteID=");
        for (int i = 0; i < quoteIDLength() && this.quoteID(i) > 0; i++)
        {
            builder.append((char)this.quoteID(i));
        }
        builder.append('|');
        builder.append("dealRequestID=");
        for (int i = 0; i < dealRequestIDLength() && this.dealRequestID(i) > 0; i++)
        {
            builder.append((char)this.dealRequestID(i));
        }
        builder.append('|');
        builder.append("dealID=");
        for (int i = 0; i < dealIDLength() && this.dealID(i) > 0; i++)
        {
            builder.append((char)this.dealID(i));
        }
        builder.append('|');
        builder.append("fxRate=");
        final DecimalDecoder fxRate = this.fxRate();
        if (null != fxRate)
        {
            fxRate.appendTo(builder);
        }
        else
        {
            builder.append("null");
        }

        limit(originalLimit);

        return builder;
    }
    
    public ExecutionReportDecoder sbeSkip()
    {
        sbeRewind();

        return this;
    }
}
