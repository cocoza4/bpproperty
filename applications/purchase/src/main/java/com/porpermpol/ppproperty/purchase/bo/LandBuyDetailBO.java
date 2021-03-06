package com.porpermpol.ppproperty.purchase.bo;

import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.model.BuyType;

import java.util.Date;

public class LandBuyDetailBO {

    private Long id;
    private Long landId;
    private BuyType buyType;
    private Long buyerId;
    private String buyerFirstName;
    private String buyerLastName;
    private Float downPayment;
    private Float buyPrice;
    private Float annualInterest;
    private Float interest;
    private Float debt;
    private Integer installmentMonths; // number of months to pay by installments
    private Float installmentPerMonth; // amount of money for installment per month
    private Float totalPayment;
    private String description;
    private Area area;
    private Date createdTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLandId() {
        return landId;
    }

    public void setLandId(Long landId) {
        this.landId = landId;
    }

    public BuyType getBuyType() {
        return buyType;
    }

    public void setBuyType(BuyType buyType) {
        this.buyType = buyType;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
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

    public Float getTotalPayment() {
        return totalPayment;
    }

    public void setTotalPayment(Float totalPayment) {
        this.totalPayment = totalPayment;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Area getArea() {
        return area;
    }

    public void setArea(Area area) {
        this.area = area;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

}
