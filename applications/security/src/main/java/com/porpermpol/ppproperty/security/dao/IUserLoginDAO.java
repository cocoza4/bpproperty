package com.porpermpol.ppproperty.security.dao;

import com.porpermpol.ppproperty.security.model.UserLogin;
import org.springframework.data.repository.CrudRepository;

public interface IUserLoginDAO extends CrudRepository<UserLogin, Long> {
    UserLogin findByUsername(String username);
}
