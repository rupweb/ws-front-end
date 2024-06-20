/* Generated SBE (Simple Binary Encoding) message codec. */
package agrona;

@SuppressWarnings("all")
public enum KycStatus
{
    NOT_STARTED((short)0),

    PENDING((short)1),

    VERIFIED((short)2),

    OTHER((short)3),

    /**
     * To be used to represent not present or null.
     */
    NULL_VAL((short)255);

    private final short value;

    KycStatus(final short value)
    {
        this.value = value;
    }

    /**
     * The raw encoded value in the Java type representation.
     *
     * @return the raw value encoded.
     */
    public short value()
    {
        return value;
    }

    /**
     * Lookup the enum value representing the value.
     *
     * @param value encoded to be looked up.
     * @return the enum value representing the value.
     */
    public static KycStatus get(final short value)
    {
        switch (value)
        {
            case 0: return NOT_STARTED;
            case 1: return PENDING;
            case 2: return VERIFIED;
            case 3: return OTHER;
            case 255: return NULL_VAL;
        }

        throw new IllegalArgumentException("Unknown value: " + value);
    }
}
