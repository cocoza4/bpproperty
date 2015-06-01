package com.porpermpol.ppproperty.purchase.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;
import com.porpermpol.ppproperty.property.model.Area;

public class LandBuyDetail extends PersistableModel<Long> {

    private Long propertyId;
    private Long customerId;
    private BuyType buyType;
    private Float downPayment;
    private Float buyPrice;
    private Float annualInterest;
    private Integer yearsOfInstallment;
    private String description;
    private Area area;

    public Long getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Long propertyId) {
        this.propertyId = propertyId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BuyType getBuyType() {
        return buyType;
    }

    public void setBuyType(BuyType buyType) {
        this.buyType = buyType;
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

    public Integer getYearsOfInstallment() {
        return yearsOfInstallment;
    }

    public void setYearsOfInstallment(Integer yearsOfInstallment) {
        this.yearsOfInstallment = yearsOfInstallment;
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

    @Override
    public String toString() {
        return "LandBuyDetail{" +
                "propertyId=" + propertyId +
                ", customerId=" + customerId +
                ", buyType=" + buyType +
                ", downPayment=" + downPayment +
                ", buyPrice=" + buyPrice +
                ", annualInterest=" + annualInterest +
                ", yearsOfInstallment=" + yearsOfInstallment +
                ", description='" + description + '\'' +
                ", area=" + area +
                '}';
    }
}
