package com.porpermpol.ppproperty.purchase.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.util.Date;

@Deprecated
public class Installment extends PersistableModel<Long> {

    private Long buyDetailId;
    private Date payFor;
    private Float amount;
    private String description;

    public Installment() {}

    public Installment(Long id, Long buyDetailId, Date payFor, Float amount, String description,
                       Long createdBy, Date createdTime, Long updatedBy, Date updatedTime) {
        super(id, createdBy, createdTime, updatedBy, updatedTime);
        this.buyDetailId = buyDetailId;
        this.payFor = payFor;
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
