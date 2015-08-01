package com.porpermpol.ppproperty.security.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.security.dao.IUserLoginDAO;
import com.porpermpol.ppproperty.security.model.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class UserLoginDAO extends JdbcRepository<UserLogin, Long> implements IUserLoginDAO {

    @Autowired
    private JdbcOperations jdbcOperations;

    private static final String SQL_SELECT_BY_USERNAME = "SELECT * FROM user_login WHERE username = ?";

    public UserLoginDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "user_login", "id");
    }

    public static final RowMapper<UserLogin> ROW_MAPPER = new RowMapper<UserLogin>() {
        @Override
        public UserLogin mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new UserLogin(rs.getLong("id"),
                    rs.getString("username"),
                    rs.getString("password"),
                    rs.getLong("created_by"),
                    new Date(rs.getLong("created_time")),
                    ModelUtils.getNullableLongField(rs, "updated_by"),
                    ModelUtils.getNullableDateField(rs, "updated_time")).withPersisted(true);
        }
    };

    private static final RowUnmapper<UserLogin> ROW_UNMAPPER = new RowUnmapper<UserLogin>() {
        @Override
        public Map<String, Object> mapColumns(UserLogin model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("username", model.getUsername());
            mapping.put("password", model.getPassword());
            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected UserLogin postCreate(UserLogin entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected UserLogin postUpdate(UserLogin entity) {
        return entity.withPersisted(true);
    }

    @Override
    public UserLogin findByUsername(String username) {
        UserLogin userLogin = null;
        try {
            userLogin = jdbcOperations.queryForObject(SQL_SELECT_BY_USERNAME, ROW_MAPPER, username);
        } catch (EmptyResultDataAccessException e) {
        }
        return userLogin;
    }
}
