package com.porpermpol.ppproperty.security.dao;

import com.porpermpol.ppproperty.security.model.UserLogin;

public interface IUserLoginDAO {

    UserLogin findByUsername(String username);

}
