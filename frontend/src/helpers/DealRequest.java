package helpers;

public class DealRequest {

    private double amount;
    private String currency;
    private String side;
    private String symbol;
    private String deliveryDate;
    private String transactTime;
    private String quoteRequestID;
    private String quoteID;
    private String dealRequestID;
    private String ticketRef;
    private double fxRate;

    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    public String getSide() {
        return side;
    }
    public void setSide(String side) {
        this.side = side;
    }
    public String getSymbol() {
        return symbol;
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    public String getDeliveryDate() {
        return deliveryDate;
    }
    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
    public String getTransactTime() {
        return transactTime;
    }
    public void setTransactTime(String transactTime) {
        this.transactTime = transactTime;
    }
    public String getQuoteRequestID() {
        return quoteRequestID;
    }
    public void setQuoteRequestID(String quoteRequestID) {
        this.quoteRequestID = quoteRequestID;
    }
    public String getQuoteID() {
        return quoteID;
    }
    public void setQuoteID(String quoteID) {
        this.quoteID = quoteID;
    }
    public String getDealRequestID() {
        return dealRequestID;
    }
    public void setDealRequestID(String dealRequestID) {
        this.dealRequestID = dealRequestID;
    }
    public String getTicketRef() {
        return ticketRef;
    }
    public void setTicketRef(String ticketRef) {
        this.ticketRef = ticketRef;
    }
    public double getFxRate() {
        return fxRate;
    }
    public void setFxRate(double fxRate) {
        this.fxRate = fxRate;
    }
}
