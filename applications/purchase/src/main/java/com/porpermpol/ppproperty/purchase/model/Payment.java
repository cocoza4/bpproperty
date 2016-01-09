package com.porpermpol.ppproperty.purchase.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.util.Date;

public class Payment extends PersistableModel<Long> {

    private Long buyDetailId;
    private Date payFor;
    private boolean isDownPayment;
    private Float amount;
    private String description;

    public Payment() {}

    public Payment(Long id, Long buyDetailId, Date payFor, boolean isDownPayment, Float amount, String description,
                       Long createdBy, Date createdTime, Long updatedBy, Date updatedTime) {
        super(id, createdBy, createdTime, updatedBy, updatedTime);
        this.buyDetailId = buyDetailId;
        this.payFor = payFor;
        this.isDownPayment = isDownPayment;
        this.amount = amount;
        this.description = description;
    }

    public Long getBuyDetailId() {
        return buyDetailId;
    }

    public void setBuyDetailId(Long buyDetailId) {
        this.buyDetailId = buyDetailId;
    }

    public Date getPayFor() {
        return payFor;
    }

    public void setPayFor(Date payFor) {
        this.payFor = payFor;
    }

    @JsonProperty("isDownPayment")
    public boolean isDownPayment() {
        return isDownPayment;
    }

    public void setIsDownPayment(boolean isDownPayment) {
        this.isDownPayment = isDownPayment;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
