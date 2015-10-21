package com.porpermpol.ppproperty.person.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
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
}
