package com.porpermpol.ppproperty.person.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class CustomerDAO extends JdbcRepository<Customer, Long> implements ICustomerDAO {

    public CustomerDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "CUSTOMER", "ID");
    }

    public static final RowMapper<Customer> ROW_MAPPER = new RowMapper<Customer>() {
        @Override
        public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
            Customer customer = new Customer();
            customer.setId(rs.getLong("ID"));
            customer.setFirstName(rs.getString("FIRSTNAME"));
            customer.setLastName(rs.getString("LASTNAME"));
            customer.setAddress(rs.getString("ADDRESS"));
            customer.setTel(rs.getString("TEL"));
            customer.setCreatedBy(rs.getLong("CREATED_BY"));
            customer.setCreatedTime(new Date(rs.getLong("CREATED_TIME")));
            customer.setUpdatedBy(ModelUtils.getNullableLongField(rs, "UPDATED_BY"));
            customer.setUpdatedTime(ModelUtils.getNullableDateField(rs, "UPDATED_TIME"));
            return customer.withPersisted(true);
        }
    };

    private static final RowUnmapper<Customer> ROW_UNMAPPER = new RowUnmapper<Customer>() {
        @Override
        public Map<String, Object> mapColumns(Customer model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("ID", model.getId());
            mapping.put("FIRSTNAME", model.getFirstName());
            mapping.put("LASTNAME", model.getLastName());
            mapping.put("ADDRESS", model.getAddress());
            mapping.put("TEL", model.getTel());
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
}
