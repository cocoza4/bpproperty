package com.porpermpol.ppproperty.core.jdbcrepository.extension;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcOperations;

public abstract class JdbcDao {

    @Autowired
    private JdbcOperations jdbcOperations;


}
