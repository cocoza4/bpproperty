package com.porpermpol.ppproperty.person.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class CustomerDAO extends JdbcRepository<Customer, Long> implements ICustomerDAO {

    @Autowired
    private JdbcOperations jdbcOperations;

    private static final String SQL_SELECT_ALL = "SELECT * FROM customer";
    private static final String SQL_COUNT = "SELECT count(*) FROM customer";

    public CustomerDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "customer", "id");
        setSqlGenerator(new PostgreSqlGenerator());
    }

    public static final RowMapper<Customer> ROW_MAPPER = new RowMapper<Customer>() {
        @Override
        public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Customer customer = new Customer();
            customer.setId(rs.getLong("id"));
            customer.setFirstName(rs.getString("firstname"));
            customer.setLastName(rs.getString("lastname"));
            customer.setAddress(rs.getString("address"));
            customer.setTel(rs.getString("tel"));
            customer.setDescription(rs.getString("description"));
            customer.setCreatedBy(rs.getLong("created_by"));
            customer.setCreatedTime(new Date(rs.getLong("created_time")));
            customer.setUpdatedBy(ModelUtils.getNullableLongField(rs, "updated_by"));
            customer.setUpdatedTime(ModelUtils.getNullableDateField(rs, "updated_time"));
            return customer.withPersisted(true);
        }
    };

    private static final RowUnmapper<Customer> ROW_UNMAPPER = new RowUnmapper<Customer>() {
        @Override
        public Map<String, Object> mapColumns(Customer model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("firstname", model.getFirstName());
            mapping.put("lastname", model.getLastName());
            mapping.put("address", model.getAddress());
            mapping.put("tel", model.getTel());
            mapping.put("description", model.getDescription());
            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected Customer postCreate(Customer entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected Customer postUpdate(Customer entity) {
        return entity.withPersisted(true);
    }

    @Override
    public Page<Customer> findByCriteria(String firstname, String lastname, String address, String tel, Pageable pageable) {
        StringBuilder sql = new StringBuilder(SQL_SELECT_ALL);
        StringBuilder whereClause = new StringBuilder();
        Object[] params = this.buildSQLConditions(whereClause, firstname, lastname, address, tel);
        sql.append(whereClause)
                .append(JdbcDao.sortingClauseIfRequired(pageable.getSort()))
                .append(JdbcDao.limitClause(pageable));
        List<Customer> customers = jdbcOperations.query(sql.toString(), ROW_MAPPER, params);
        long criteriaCount = this.countByCriteria(whereClause.toString(), params);

        return new PageImpl<>(customers, pageable, criteriaCount);
    }

    private long countByCriteria(String whereClause, Object[] params) {
        StringBuilder sb = new StringBuilder(SQL_COUNT).append(whereClause);
        return jdbcOperations.queryForObject(sb.toString(), Long.class, params);
    }


    private Object[] buildSQLConditions(StringBuilder sql, String firstname, String lastname, String address, String tel) {

        List<Object> params = new ArrayList<>();
        List<String> conditions = new ArrayList<>();

        if (!StringUtils.isEmpty(firstname)) {
            conditions.add("lower(firstname) LIKE ?");
            params.add(firstname.toLowerCase() + "%");
        }
        if (!StringUtils.isEmpty(lastname)) {
            conditions.add("lower(lastname) LIKE ?");
            params.add(lastname.toLowerCase() + "%");
        }
        if (!StringUtils.isEmpty(address)) {
            conditions.add("lower(address) LIKE ?");
            params.add(address.toLowerCase() + "%");
        }
        if (!StringUtils.isEmpty(tel)) {
            conditions.add("tel LIKE ?");
            params.add(tel + "%");
        }

        if (!conditions.isEmpty()) {
            sql.append(" WHERE ")
                    .append(StringUtils.join(conditions, " AND "));
        }

        return params.toArray();
    }
}
