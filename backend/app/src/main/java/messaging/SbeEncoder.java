package messaging;

import agrona.messages.DealRequestEncoder;
import agrona.messages.ExecutionReportEncoder;
import agrona.messages.KycStatus;
import agrona.messages.QuoteEncoder;
import agrona.messages.QuoteRequestEncoder;
import agrona.messages.ErrorEncoder;
import agrona.messages.DecimalEncoder;
import agrona.messages.MessageHeaderEncoder;
import org.agrona.DirectBuffer;
import org.agrona.concurrent.UnsafeBuffer;

public class SbeEncoder {
    public DirectBuffer encodeDealRequest(double amount, String currency, String side, String symbol,
                                          String deliveryDate, String transactTime, String quoteRequestID,
                                          String quoteID, String dealRequestID, double fxRate) {

        DealRequestEncoder encoder = new DealRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[DealRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        long mantissa = Math.round(amount * 100); // Amounts are always to 2 decimal places
        byte exponent = -2;
        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);

        long mantissa2 = Math.round(fxRate * 100000); // Rates to 5 dp
        byte exponent2 = -5;
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa(mantissa2).exponent(exponent2);

        return buffer;
    }

    public DirectBuffer encodeQuoteRequest(double amount, String saleCurrency, String side, String symbol, String deliveryDate, 
                                            String transactTime, String quoteRequestID, String currencyOwned, KycStatus kycStatus) {

        QuoteRequestEncoder encoder = new QuoteRequestEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[QuoteRequestEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        long mantissa = Math.round(amount * 100); // Amounts are always to 2 decimal places
        byte exponent = -2;
        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.saleCurrency(saleCurrency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.currencyOwned(currencyOwned);
        encoder.kycStatus(kycStatus);

        return buffer;
    }

    public DirectBuffer encodeQuote(double amount, String currency, String side, String symbol, 
                            String transactTime, String quoteID, String quoteRequestID, 
                            double fxRate, double secondaryAmount) {

        QuoteEncoder encoder = new QuoteEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[QuoteEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        long mantissa = Math.round(amount * 100); // Amounts are always to 2 decimal places
        byte exponent = -2;
        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.transactTime(transactTime);
        encoder.quoteID(quoteID);
        encoder.quoteRequestID(quoteRequestID);

        long mantissa2 = Math.round(fxRate * 100000); // Rates to 5 dp
        byte exponent2 = -5;
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa(mantissa2).exponent(exponent2);

        mantissa = Math.round(secondaryAmount * 100); // Amounts to 2 dp
        exponent = -2;
        DecimalEncoder secondaryAmountEncoder = new DecimalEncoder();
        secondaryAmountEncoder.wrap(buffer, encoder.secondaryAmount().offset()).mantissa(mantissa).exponent(exponent);

        return buffer;
    }

    public DirectBuffer encodeExecutionReport(double amount, String currency, double secondaryAmount, String secondaryCurrency,
                                              String side, String symbol, String deliveryDate, String transactTime,
                                              String quoteRequestID, String quoteID, String dealRequestID, String dealID,
                                              double fxRate) {

        ExecutionReportEncoder encoder = new ExecutionReportEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[ExecutionReportEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        long mantissa = Math.round(amount * 100); // Amounts are always to 2 decimal places
        byte exponent = -2;
        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.currency(currency);

        mantissa = Math.round(secondaryAmount * 100); // Amounts to 2 dp
        exponent = -2;
        DecimalEncoder secondaryAmountEncoder = new DecimalEncoder();
        secondaryAmountEncoder.wrap(buffer, encoder.secondaryAmount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.secondaryCurrency(secondaryCurrency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);
        encoder.dealID(dealID);

        mantissa = Math.round(fxRate * 100000); // Rates to 5 dp
        exponent = -5;
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa(mantissa).exponent(exponent);

        return buffer;
    }

    public DirectBuffer encodeError(double amount, String currency, String side, String symbol, 
                                    String deliveryDate, String transactTime, String quoteRequestID,
                                    String quoteID, String dealRequestID, String dealID, double fxRate, 
                                    double secondaryAmount, String message) {

        ErrorEncoder encoder = new ErrorEncoder();
        UnsafeBuffer buffer = new UnsafeBuffer(new byte[ErrorEncoder.BLOCK_LENGTH + MessageHeaderEncoder.ENCODED_LENGTH]);

        encoder.wrapAndApplyHeader(buffer, 0, new MessageHeaderEncoder());

        long mantissa = Math.round(amount * 100); // Amounts are always to 2 decimal places
        byte exponent = -2;
        DecimalEncoder amountEncoder = new DecimalEncoder();
        amountEncoder.wrap(buffer, encoder.amount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.currency(currency);
        encoder.side(side);
        encoder.symbol(symbol);
        encoder.deliveryDate(deliveryDate);
        encoder.transactTime(transactTime);
        encoder.quoteRequestID(quoteRequestID);
        encoder.quoteID(quoteID);
        encoder.dealRequestID(dealRequestID);
        encoder.dealID(dealID);

        mantissa = Math.round(fxRate * 100000); // Rates to 5 dp
        exponent = -5;
        DecimalEncoder fxRateEncoder = new DecimalEncoder();
        fxRateEncoder.wrap(buffer, encoder.fxRate().offset()).mantissa(mantissa).exponent(exponent);

        mantissa = Math.round(secondaryAmount * 100); // Amounts to 2 dp
        exponent = -2;
        DecimalEncoder secondaryAmountEncoder = new DecimalEncoder();
        secondaryAmountEncoder.wrap(buffer, encoder.secondaryAmount().offset()).mantissa(mantissa).exponent(exponent);

        encoder.message(message);

        return buffer;
    }
}
