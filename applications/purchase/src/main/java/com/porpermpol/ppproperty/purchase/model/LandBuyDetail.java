package com.porpermpol.ppproperty.purchase.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;
import com.porpermpol.ppproperty.property.model.Area;

public class LandBuyDetail extends PersistableModel<Long> {

    private Long landId;
    private Long customerId;
    private BuyType buyType;
    private Float buyPrice;
    private Float annualInterest;
    private Integer installmentMonths;
    private String description;
    private Area area;

    public Long getLandId() {
        return landId;
    }

    public void setLandId(Long landId) {
        this.landId = landId;
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

    public Integer getInstallmentMonths() {
        return installmentMonths;
    }

    public void setInstallmentMonths(Integer installmentMonths) {
        this.installmentMonths = installmentMonths;
    }

    @Override
    public String toString() {
        return "LandBuyDetail{" +
                "landId=" + landId +
                ", customerId=" + customerId +
                ", buyType=" + buyType +
                ", buyPrice=" + buyPrice +
                ", annualInterest=" + annualInterest +
                ", installmentMonths=" + installmentMonths +
                ", description='" + description + '\'' +
                ", area=" + area +
                '}';
    }
}
