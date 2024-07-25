package helpers;

public class ExecutionReport {

    private double amount;
    private String currency;
    private double secondaryAmount;
    private String secondaryCurrency;
    private String side;
    private String symbol;
    private String deliveryDate;
    private String transactTime;
    private String quoteRequestID;
    private String quoteID;
    private String dealRequestID;
    private String dealID;
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
    public double getSecondaryAmount() {
        return secondaryAmount;
    }
    public void setSecondaryAmount(double secondaryAmount) {
        this.secondaryAmount = secondaryAmount;
    }
    public String getSecondaryCurrency() {
        return secondaryCurrency;
    }
    public void setSecondaryCurrency(String secondaryCurrency) {
        this.secondaryCurrency = secondaryCurrency;
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
    public String getDealID() {
        return dealID;
    }
    public void setDealID(String dealID) {
        this.dealID = dealID;
    }
    public double getFxRate() {
        return fxRate;
    }
    public void setFxRate(double fxRate) {
        this.fxRate = fxRate;
    }
    
    
}
