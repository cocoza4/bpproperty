package com.porpermpol.ppproperty.purchase.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.util.Date;

public class InstallmentRecord extends PersistableModel<Long> {

    private Long buyDetailId;
    private Date paymentDate;
    private Float amount;
    private Long receiverId;

    public InstallmentRecord() {}

    public InstallmentRecord(Long id, Long buyDetailId, Date paymentDate, Float amount, Long receiverId,
                             Long createdBy, Date createdTime, Long updatedBy, Date updatedTime) {
        super(id, createdBy, createdTime, updatedBy, updatedTime);
        this.buyDetailId = buyDetailId;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.receiverId = receiverId;
    }

    public Long getBuyDetailId() {
        return buyDetailId;
    }

    public void setBuyDetailId(Long buyDetailId) {
        this.buyDetailId = buyDetailId;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
}
