package com.porpermpol.ppproperty.purchase.bo;

import com.porpermpol.ppproperty.purchase.model.BuyType;

public class ReceiptBO {

    private String landName;
    private Long landBuyDetailId;
    private BuyType buyType;
    private String buyerFirstName;
    private String buyerLastName;
    private String buyerTel;
    private String buyerAddress;
    private Float downPayment;
    private Float buyPrice;
    private Float annualInterest;
    private Float interest;
    private Float debt;
    private Integer installmentMonths; // number of months to pay by installments
    private Float installmentPerMonth; // amount of money for installment per month
    private Float accPayment;

    public String getLandName() {
        return landName;
    }

    public void setLandName(String landName) {
        this.landName = landName;
    }

    public Long getLandBuyDetailId() {
        return landBuyDetailId;
    }

    public void setLandBuyDetailId(Long landBuyDetailId) {
        this.landBuyDetailId = landBuyDetailId;
    }

    public BuyType getBuyType() {
        return buyType;
    }

    public void setBuyType(BuyType buyType) {
        this.buyType = buyType;
    }

    public String getBuyerFirstName() {
        return buyerFirstName;
    }

    public void setBuyerFirstName(String buyerFirstName) {
        this.buyerFirstName = buyerFirstName;
    }

    public String getBuyerLastName() {
        return buyerLastName;
    }

    public void setBuyerLastName(String buyerLastName) {
        this.buyerLastName = buyerLastName;
    }

    public String getBuyerTel() {
        return buyerTel;
    }

    public void setBuyerTel(String buyerTel) {
        this.buyerTel = buyerTel;
    }

    public String getBuyerAddress() {
        return buyerAddress;
    }

    public void setBuyerAddress(String buyerAddress) {
        this.buyerAddress = buyerAddress;
    }

    public Float getDownPayment() {
        return downPayment;
    }

    public void setDownPayment(Float downPayment) {
        this.downPayment = downPayment;
    }

    public Float getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(Float buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Float getAnnualInterest() {
        return annualInterest;
    }

    public void setAnnualInterest(Float annualInterest) {
        this.annualInterest = annualInterest;
    }

    public Float getInterest() {
        return interest;
    }

    public void setInterest(Float interest) {
        this.interest = interest;
    }

    public Float getDebt() {
        return debt;
    }

    public void setDebt(Float debt) {
        this.debt = debt;
    }

    public Integer getInstallmentMonths() {
        return installmentMonths;
    }

    public void setInstallmentMonths(Integer installmentMonths) {
        this.installmentMonths = installmentMonths;
    }

    public Float getInstallmentPerMonth() {
        return installmentPerMonth;
    }

    public void setInstallmentPerMonth(Float installmentPerMonth) {
        this.installmentPerMonth = installmentPerMonth;
    }

    public Float getAccPayment() {
        return accPayment;
    }

    public void setAccPayment(Float accPayment) {
        this.accPayment = accPayment;
    }

    @Override
    public String toString() {
        return "ReceiptBO{" +
                "landName='" + landName + '\'' +
                ", landBuyDetailId=" + landBuyDetailId +
                ", buyType=" + buyType +
                ", buyerFirstName='" + buyerFirstName + '\'' +
                ", buyerLastName='" + buyerLastName + '\'' +
                ", buyerTel='" + buyerTel + '\'' +
                ", buyerAddress='" + buyerAddress + '\'' +
                ", downPayment=" + downPayment +
                ", buyPrice=" + buyPrice +
                ", annualInterest=" + annualInterest +
                ", interest=" + interest +
                ", debt=" + debt +
                ", installmentMonths=" + installmentMonths +
                ", installmentPerMonth=" + installmentPerMonth +
                ", accPayment=" + accPayment +
                '}';
    }
}
