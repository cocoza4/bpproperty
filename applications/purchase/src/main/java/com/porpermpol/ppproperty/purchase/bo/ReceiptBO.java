package com.porpermpol.ppproperty.purchase.bo;

public class ReceiptBO {

    private String name;
    private String type;
    private Float price;
    private Float accumulatedPayment;
    private Float debt;

    public ReceiptBO(String name, String type, Float price, Float accumulatedPayment, Float debt) {
        this.name = name;
        this.type = type;
        this.price = price;
        this.accumulatedPayment = accumulatedPayment;
        this.debt = debt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Float getPrice() {
        return price;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Float getAccumulatedPayment() {
        return accumulatedPayment;
    }

    public void setAccumulatedPayment(Float accumulatedPayment) {
        this.accumulatedPayment = accumulatedPayment;
    }

    public Float getDebt() {
        return debt;
    }

    public void setDebt(Float debt) {
        this.debt = debt;
    }
}
