package com.porpermpol.ppproperty.property.model;


import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.util.Date;

public class Land extends PersistableModel<Long> {

    private String name;
    private String address;
    private String description;
    private Area area;

    public Land() {
    }

    public Land(Long id, String name, Area area, String address, String description, Long createdBy, Date createdTime,
                Long updatedBy, Date updatedTime) {
        super(id, createdBy, createdTime, updatedBy, updatedTime);
        this.name = name;
        this.description = description;
        this.address = address;
        this.area = area;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
}
