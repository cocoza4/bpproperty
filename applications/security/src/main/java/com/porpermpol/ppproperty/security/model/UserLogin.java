package com.porpermpol.ppproperty.security.model;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.util.Date;

public class UserLogin extends PersistableModel<Long> {

    private String username;
    private String password;

    public UserLogin() {
    }

    public UserLogin(Long id, String username, String password, Long createdBy, Date createdTime,
                Long updatedBy, Date updatedTime) {
        super(id, createdBy, createdTime, updatedBy, updatedTime);
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserLogin{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
