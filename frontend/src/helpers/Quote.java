package helpers;

public class Quote {

    private double amount;
    private String currency;
    private double fxRate;
    private String transactTime;
    private String side;
    private String symbol;
    private String quoteID;
    private String quoteRequestID;

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
    public double getFxRate() {
        return fxRate;
    }
    public void setFxRate(double fxRate) {
        this.fxRate = fxRate;
    }
    public String getTransactTime() {
        return transactTime;
    }
    public void setTransactTime(String transactTime) {
        this.transactTime = transactTime;
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
    public String getQuoteID() {
        return quoteID;
    }
    public void setQuoteID(String quoteID) {
        this.quoteID = quoteID;
    }
    public String getQuoteRequestID() {
        return quoteRequestID;
    }
    public void setQuoteRequestID(String quoteRequestID) {
        this.quoteRequestID = quoteRequestID;
    }  
}
