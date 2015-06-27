package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentRecordDAO;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
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
public class InstallmentRecordDAO extends JdbcRepository<InstallmentRecord, Long> implements IInstallmentRecordDAO {

    @Autowired
    private JdbcOperations jdbcOperations;

    private static final String SQL_SELECT_BY_LAND_BUY_DETAIL_ID = "SELECT * FROM installments_record " +
                                                                            "WHERE buy_detail_id = ? " +
                                                                            "ORDER BY pay_for ASC";

    public InstallmentRecordDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "INSTALLMENTS_RECORD", "id");
    }

    public static final RowMapper<InstallmentRecord> ROW_MAPPER = new RowMapper<InstallmentRecord>() {
        @Override
        public InstallmentRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new InstallmentRecord(rs.getLong("id"),
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

    private static final RowUnmapper<InstallmentRecord> ROW_UNMAPPER = new RowUnmapper<InstallmentRecord>() {
        @Override
        public Map<String, Object> mapColumns(InstallmentRecord model) {
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
    protected InstallmentRecord postCreate(InstallmentRecord entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected InstallmentRecord postUpdate(InstallmentRecord entity) {
        return entity.withPersisted(true);
    }

    @Override
    public List<InstallmentRecord> findByLandBuyDetailId(long id) {
        return jdbcOperations.query(SQL_SELECT_BY_LAND_BUY_DETAIL_ID, ROW_MAPPER, id);
    }
}
