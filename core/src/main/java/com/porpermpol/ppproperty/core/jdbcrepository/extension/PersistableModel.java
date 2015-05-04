package com.porpermpol.ppproperty.core.jdbcrepository.extension;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.domain.Persistable;

import java.io.Serializable;
import java.util.Date;

public abstract class PersistableModel<ID extends Serializable> implements Persistable<ID> {

    transient protected boolean persisted = false;

    protected ID id;
    protected Long createdBy;
    protected Date createdTime;
    protected Long updatedBy;
    protected Date updatedTime;

    public PersistableModel() {
    }

    public PersistableModel(ID id) {
        this.id = id;
    }

    public PersistableModel(ID id, Long createdBy, Date createdTime, Long updatedBy, Date updatedTime) {
        this.id = id;
        this.createdBy = createdBy;
        this.createdTime = createdTime;
        this.updatedBy = updatedBy;
        this.updatedTime = updatedTime;
    }

    public <T extends PersistableModel<ID>> T withPersisted(boolean persisted) {
        this.persisted = persisted;
        return (T) this;
    }

    @JsonIgnore
    @Override
    public boolean isNew() {
        return !persisted;
    }

    @JsonIgnore
    public boolean isPersisted() {
        return persisted;
    }

    public void setPersisted(boolean persisted) {
        this.persisted = persisted;
    }

    @Override
    public ID getId() {
        return id;
    }

    public void setId(ID id) {
        this.id = id;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Date updatedTime) {
        this.updatedTime = updatedTime;
    }
}