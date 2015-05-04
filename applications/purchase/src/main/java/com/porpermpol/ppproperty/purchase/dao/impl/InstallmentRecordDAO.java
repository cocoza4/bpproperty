package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentRecordDAO;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class InstallmentRecordDAO extends JdbcRepository<InstallmentRecord, Long> implements IInstallmentRecordDAO {

    public InstallmentRecordDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "INSTALLMENTS_RECORD", "ID");
    }

    public static final RowMapper<InstallmentRecord> ROW_MAPPER = new RowMapper<InstallmentRecord>() {
        @Override
        public InstallmentRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new InstallmentRecord(rs.getLong("ID"),
                    rs.getLong("BUY_DETAIL_ID"),
                    new Date(rs.getLong("PAYMENT_DATE")),
                    rs.getFloat("AMOUNT"),
                    rs.getLong("RECEIVER_ID"),
                    rs.getLong("CREATED_BY"),
                    new Date(rs.getLong("CREATED_TIME")),
                    ModelUtils.getNullableLongField(rs, "UPDATED_BY"),
                    ModelUtils.getNullableDateField(rs, "UPDATED_TIME")).withPersisted(true);
        }
    };

    private static final RowUnmapper<InstallmentRecord> ROW_UNMAPPER = new RowUnmapper<InstallmentRecord>() {
        @Override
        public Map<String, Object> mapColumns(InstallmentRecord model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("ID", model.getId());
            mapping.put("BUY_DETAIL_ID", model.getBuyDetailId());
            mapping.put("PAYMENT_DATE", model.getPaymentDate().getTime());
            mapping.put("AMOUNT", model.getAmount());
            mapping.put("RECEIVER_ID", model.getReceiverId());
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

}
