package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.model.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PaymentDAO extends JdbcRepository<Payment, Long> implements IPaymentDAO {

    @Autowired
    private JdbcOperations jdbcOperations;

    private static final String SQL_SELECT_BY_LAND_BUY_DETAIL_ID = "SELECT * FROM payment " +
            "WHERE buy_detail_id = ? " +
            "ORDER BY pay_for, id ASC";
    private static final String SQL_COUNT_BY_LAND_BUY_DETAIL_ID = "SELECT count(*) FROM payment " +
            "WHERE buy_detail_id = ?";

    public PaymentDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "payment", "id");
        setSqlGenerator(new PostgreSqlGenerator());
    }

    public static final RowMapper<Payment> ROW_MAPPER = new RowMapper<Payment>() {
        @Override
        public Payment mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Payment(rs.getLong("id"),
                    rs.getLong("buy_detail_id"),
                    rs.getObject("pay_for") == null ? null : new Date(rs.getLong("pay_for")),
                    rs.getBoolean("is_down_payment"),
                    rs.getFloat("amount"),
                    rs.getString("description"),
                    rs.getLong("created_by"),
                    new Date(rs.getLong("created_time")),
                    ModelUtils.getNullableLongField(rs, "updated_by"),
                    ModelUtils.getNullableDateField(rs, "updated_time")).withPersisted(true);
        }
    };

    private static final RowUnmapper<Payment> ROW_UNMAPPER = new RowUnmapper<Payment>() {
        @Override
        public Map<String, Object> mapColumns(Payment model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("buy_detail_id", model.getBuyDetailId());
            mapping.put("pay_for", model.getPayFor() == null ? null : model.getPayFor().getTime());
            mapping.put("is_down_payment", model.isDownPayment());
            mapping.put("amount", model.getAmount());
            mapping.put("description", model.getDescription());
            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected Payment postCreate(Payment entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected Payment postUpdate(Payment entity) {
        return entity.withPersisted(true);
    }

    @Override
    public Page<Payment> findByLandBuyDetailId(long id, Pageable pageable) {

        StringBuilder sql = new StringBuilder(SQL_SELECT_BY_LAND_BUY_DETAIL_ID)
                .append(JdbcDao.limitClause(pageable));
        List<Payment> payments = jdbcOperations.query(sql.toString(), ROW_MAPPER, id);
        long criteriaCount = this.countByCriteria(id);

        return new PageImpl<>(payments, pageable, criteriaCount);
    }

    private long countByCriteria(long id) {
        return jdbcOperations.queryForObject(SQL_COUNT_BY_LAND_BUY_DETAIL_ID, Long.class, id);
    }
}
