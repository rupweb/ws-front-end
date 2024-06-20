/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona;

import org.agrona.DirectBuffer;


/**
 * Quote Request message
 */
@SuppressWarnings("all")
public final class QuoteRequestDecoder
{
    public static final int BLOCK_LENGTH = 290;
    public static final int TEMPLATE_ID = 3;
    public static final int SCHEMA_ID = 1;
    public static final int SCHEMA_VERSION = 1;
    public static final String SEMANTIC_VERSION = "";
    public static final java.nio.ByteOrder BYTE_ORDER = java.nio.ByteOrder.LITTLE_ENDIAN;

    private final QuoteRequestDecoder parentMessage = this;
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

    public QuoteRequestDecoder wrap(
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

    public QuoteRequestDecoder wrapAndApplyHeader(
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

    public QuoteRequestDecoder sbeRewind()
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
     * The sale price
     *
     * @return DecimalDecoder : The sale price
     */
    public DecimalDecoder amount()
    {
        amount.wrap(buffer, offset + 8);
        return amount;
    }

    public static int saleCurrencyId()
    {
        return 2;
    }

    public static int saleCurrencySinceVersion()
    {
        return 0;
    }

    public static int saleCurrencyEncodingOffset()
    {
        return 17;
    }

    public static int saleCurrencyEncodingLength()
    {
        return 3;
    }

    public static String saleCurrencyMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte saleCurrencyNullValue()
    {
        return (byte)0;
    }

    public static byte saleCurrencyMinValue()
    {
        return (byte)32;
    }

    public static byte saleCurrencyMaxValue()
    {
        return (byte)126;
    }

    public static int saleCurrencyLength()
    {
        return 3;
    }


    public byte saleCurrency(final int index)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 17 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String saleCurrencyCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getSaleCurrency(final byte[] dst, final int dstOffset)
    {
        final int length = 3;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 17, dst, dstOffset, length);

        return length;
    }

    public String saleCurrency()
    {
        final byte[] dst = new byte[3];
        buffer.getBytes(offset + 17, dst, 0, 3);

        int end = 0;
        for (; end < 3 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int deliveryDateId()
    {
        return 3;
    }

    public static int deliveryDateSinceVersion()
    {
        return 0;
    }

    public static int deliveryDateEncodingOffset()
    {
        return 20;
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

        final int pos = offset + 20 + (index * 1);

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

        buffer.getBytes(offset + 20, dst, dstOffset, length);

        return length;
    }

    public String deliveryDate()
    {
        final byte[] dst = new byte[10];
        buffer.getBytes(offset + 20, dst, 0, 10);

        int end = 0;
        for (; end < 10 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
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
        return 30;
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


    public byte transactTime(final int index)
    {
        if (index < 0 || index >= 19)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 30 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String transactTimeCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getTransactTime(final byte[] dst, final int dstOffset)
    {
        final int length = 19;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 30, dst, dstOffset, length);

        return length;
    }

    public String transactTime()
    {
        final byte[] dst = new byte[19];
        buffer.getBytes(offset + 30, dst, 0, 19);

        int end = 0;
        for (; end < 19 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int quoteRequestIDId()
    {
        return 5;
    }

    public static int quoteRequestIDSinceVersion()
    {
        return 0;
    }

    public static int quoteRequestIDEncodingOffset()
    {
        return 49;
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

        final int pos = offset + 49 + (index * 1);

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

        buffer.getBytes(offset + 49, dst, dstOffset, length);

        return length;
    }

    public String quoteRequestID()
    {
        final byte[] dst = new byte[36];
        buffer.getBytes(offset + 49, dst, 0, 36);

        int end = 0;
        for (; end < 36 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int sideId()
    {
        return 6;
    }

    public static int sideSinceVersion()
    {
        return 0;
    }

    public static int sideEncodingOffset()
    {
        return 85;
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

        final int pos = offset + 85 + (index * 1);

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

        buffer.getBytes(offset + 85, dst, dstOffset, length);

        return length;
    }

    public String side()
    {
        final byte[] dst = new byte[4];
        buffer.getBytes(offset + 85, dst, 0, 4);

        int end = 0;
        for (; end < 4 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int symbolId()
    {
        return 7;
    }

    public static int symbolSinceVersion()
    {
        return 0;
    }

    public static int symbolEncodingOffset()
    {
        return 89;
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

        final int pos = offset + 89 + (index * 1);

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

        buffer.getBytes(offset + 89, dst, dstOffset, length);

        return length;
    }

    public String symbol()
    {
        final byte[] dst = new byte[6];
        buffer.getBytes(offset + 89, dst, 0, 6);

        int end = 0;
        for (; end < 6 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int currencyOwnedId()
    {
        return 8;
    }

    public static int currencyOwnedSinceVersion()
    {
        return 0;
    }

    public static int currencyOwnedEncodingOffset()
    {
        return 95;
    }

    public static int currencyOwnedEncodingLength()
    {
        return 3;
    }

    public static String currencyOwnedMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public static byte currencyOwnedNullValue()
    {
        return (byte)0;
    }

    public static byte currencyOwnedMinValue()
    {
        return (byte)32;
    }

    public static byte currencyOwnedMaxValue()
    {
        return (byte)126;
    }

    public static int currencyOwnedLength()
    {
        return 3;
    }


    public byte currencyOwned(final int index)
    {
        if (index < 0 || index >= 3)
        {
            throw new IndexOutOfBoundsException("index out of range: index=" + index);
        }

        final int pos = offset + 95 + (index * 1);

        return buffer.getByte(pos);
    }


    public static String currencyOwnedCharacterEncoding()
    {
        return java.nio.charset.StandardCharsets.UTF_8.name();
    }

    public int getCurrencyOwned(final byte[] dst, final int dstOffset)
    {
        final int length = 3;
        if (dstOffset < 0 || dstOffset > (dst.length - length))
        {
            throw new IndexOutOfBoundsException("Copy will go out of range: offset=" + dstOffset);
        }

        buffer.getBytes(offset + 95, dst, dstOffset, length);

        return length;
    }

    public String currencyOwned()
    {
        final byte[] dst = new byte[3];
        buffer.getBytes(offset + 95, dst, 0, 3);

        int end = 0;
        for (; end < 3 && dst[end] != 0; ++end);

        return new String(dst, 0, end, java.nio.charset.StandardCharsets.UTF_8);
    }


    public static int kycStatusId()
    {
        return 9;
    }

    public static int kycStatusSinceVersion()
    {
        return 0;
    }

    public static int kycStatusEncodingOffset()
    {
        return 98;
    }

    public static int kycStatusEncodingLength()
    {
        return 1;
    }

    public static String kycStatusMetaAttribute(final MetaAttribute metaAttribute)
    {
        if (MetaAttribute.PRESENCE == metaAttribute)
        {
            return "required";
        }

        return "";
    }

    public short kycStatusRaw()
    {
        return ((short)(buffer.getByte(offset + 98) & 0xFF));
    }

    public KycStatus kycStatus()
    {
        return KycStatus.get(((short)(buffer.getByte(offset + 98) & 0xFF)));
    }


    public String toString()
    {
        if (null == buffer)
        {
            return "";
        }

        final QuoteRequestDecoder decoder = new QuoteRequestDecoder();
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
        builder.append("[QuoteRequest](sbeTemplateId=");
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
        builder.append("saleCurrency=");
        for (int i = 0; i < saleCurrencyLength() && this.saleCurrency(i) > 0; i++)
        {
            builder.append((char)this.saleCurrency(i));
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
        builder.append("currencyOwned=");
        for (int i = 0; i < currencyOwnedLength() && this.currencyOwned(i) > 0; i++)
        {
            builder.append((char)this.currencyOwned(i));
        }
        builder.append('|');
        builder.append("kycStatus=");
        builder.append(this.kycStatus());

        limit(originalLimit);

        return builder;
    }
    
    public QuoteRequestDecoder sbeSkip()
    {
        sbeRewind();

        return this;
    }
}
