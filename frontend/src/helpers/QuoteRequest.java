package helpers;

public class QuoteRequest {
    private double salePrice;
    private String saleCurrency;
    private String deliveryDate;
    private String transactTime;
    private String quoteRequestID;
    private String side;
    private String symbol;
    private String currencyOwned;
    private String clientID;

    public double getSalePrice() {
        return salePrice;
    }
    public void setSalePrice(double salePrice) {
        this.salePrice = salePrice;
    }
    public String getSaleCurrency() {
        return saleCurrency;
    }
    public void setSaleCurrency(String saleCurrency) {
        this.saleCurrency = saleCurrency;
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
    public String getCurrencyOwned() {
        return currencyOwned;
    }
    public void setCurrencyOwned(String currencyOwned) {
        this.currencyOwned = currencyOwned;
    }
    public String getClientID() {
        return clientID;
    }
    public void setClientID(String clientID) {
        this.clientID = clientID;
    }
}
