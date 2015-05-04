package com.porpermpol.ppproperty.person.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

public class Customer extends PersistableModel<Long> {

    private String firstName;
    private String lastName;
    private String address;
    private String tel;

    public Customer() {
    }

    public Customer(Long id, String firstName, String lastName, String address, String tel) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.tel = tel;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }
}
