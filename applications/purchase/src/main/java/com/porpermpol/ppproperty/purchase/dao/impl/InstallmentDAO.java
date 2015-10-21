package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentDAO;
import com.porpermpol.ppproperty.purchase.model.Installment;
import org.springframework.beans.factory.annotation.Autowired;
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
public class InstallmentDAO extends JdbcRepository<Installment, Long> implements IInstallmentDAO {

    @Autowired
    private JdbcOperations jdbcOperations;

    private static final String SQL_SELECT_BY_LAND_BUY_DETAIL_ID = "SELECT * FROM installment " +
                                                                            "WHERE buy_detail_id = ? " +
                                                                            "ORDER BY pay_for ASC";

    public InstallmentDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "installment", "id");
        setSqlGenerator(new PostgreSqlGenerator());
    }

    public static final RowMapper<Installment> ROW_MAPPER = new RowMapper<Installment>() {
        @Override
        public Installment mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Installment(rs.getLong("id"),
                    rs.getLong("buy_detail_id"),
                    new Date(rs.getLong("pay_for")),
                    rs.getFloat("amount"),
                    rs.getString("description"),
                    rs.getLong("created_by"),
                    new Date(rs.getLong("created_time")),
                    ModelUtils.getNullableLongField(rs, "updated_by"),
                    ModelUtils.getNullableDateField(rs, "updated_time")).withPersisted(true);
        }
    };

    private static final RowUnmapper<Installment> ROW_UNMAPPER = new RowUnmapper<Installment>() {
        @Override
        public Map<String, Object> mapColumns(Installment model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("buy_detail_id", model.getBuyDetailId());
            mapping.put("pay_for", model.getPayFor().getTime());
            mapping.put("amount", model.getAmount());
            mapping.put("description", model.getDescription());
            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected Installment postCreate(Installment entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected Installment postUpdate(Installment entity) {
        return entity.withPersisted(true);
    }

    @Override
    public List<Installment> findByLandBuyDetailId(long id) {
        return jdbcOperations.query(SQL_SELECT_BY_LAND_BUY_DETAIL_ID, ROW_MAPPER, id);
    }
}
