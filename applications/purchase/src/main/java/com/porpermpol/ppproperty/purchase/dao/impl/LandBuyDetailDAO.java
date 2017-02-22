package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
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
public class LandBuyDetailDAO extends JdbcRepository<LandBuyDetail, Long> implements ILandBuyDetailDAO {

    private static final String SQL_EXISTS = "SELECT count(*) FROM land_buy_detail WHERE land_id = ? AND customer_id = ?";
    private static final String SQL_EXISTS_BY_LAND_ID = "SELECT count(*) FROM land_buy_detail WHERE land_id = ?";
    private static final String SQL_EXISTS_BY_CUSTOMER_ID = "SELECT count(*) FROM land_buy_detail WHERE customer_id = ?";

    private static final String SQL_SELECT_BY_CUSTOMER_ID = "SELECT * FROM land_buy_detail " +
            "WHERE customer_id = ? ORDER BY created_time DESC";

    private static final String SQL_COUNT_BY_LAND_ID = "SELECT count(*) FROM land_buy_detail " +
            "WHERE land_id = ?";

    @Autowired
    private JdbcOperations jdbcOperations;

    public LandBuyDetailDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "land_buy_detail", "id");
        setSqlGenerator(new PostgreSqlGenerator());
    }

    public static final RowMapper<LandBuyDetail> ROW_MAPPER = new RowMapper<LandBuyDetail>() {
        @Override
        public LandBuyDetail mapRow(ResultSet rs, int rowNum) throws SQLException {

            LandBuyDetail model = new LandBuyDetail();
            model.setId(rs.getLong("id"));
            model.setLandId(rs.getLong("land_id"));
            model.setCustomerId(rs.getLong("customer_id"));
            model.setBuyType(BuyType.get(rs.getString("buy_type")));
            model.setBuyPrice(rs.getFloat("buy_price"));
            model.setAnnualInterest((Float)rs.getObject("annual_interest"));
            model.setInstallmentMonths((Integer)rs.getObject("installment_months"));
            model.setDescription(rs.getString("description"));
            model.setArea(new Area(rs.getInt("rai"), rs.getInt("yarn"), rs.getInt("tarangwa")));
            model.setCreatedBy(rs.getLong("created_by"));
            model.setCreatedTime(new Date(rs.getLong("created_time")));
            model.setUpdatedBy(ModelUtils.getNullableLongField(rs, "updated_by"));
            model.setUpdatedTime(ModelUtils.getNullableDateField(rs, "updated_time"));
            return model.withPersisted(true);
        }
    };

    private static final RowUnmapper<LandBuyDetail> ROW_UNMAPPER = new RowUnmapper<LandBuyDetail>() {
        @Override
        public Map<String, Object> mapColumns(LandBuyDetail model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("land_id", model.getLandId());
            mapping.put("customer_id", model.getCustomerId());
            mapping.put("buy_type", model.getBuyType().getCode());
            mapping.put("buy_price", model.getBuyPrice());
            mapping.put("annual_interest", model.getAnnualInterest());
            mapping.put("installment_months", model.getInstallmentMonths());
            mapping.put("description", model.getDescription());

            mapping.put("rai", model.getArea().getRai());
            mapping.put("yarn", model.getArea().getYarn());
            mapping.put("tarangwa", model.getArea().getTarangwa());

            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected LandBuyDetail postCreate(LandBuyDetail entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected LandBuyDetail postUpdate(LandBuyDetail entity) {
        return entity.withPersisted(true);
    }

    @Override
    public boolean existsByCustomerId(long id) {
        return jdbcOperations.queryForObject(SQL_EXISTS_BY_CUSTOMER_ID, Long.class, id) > 0;
    }

    @Override
    public boolean existsByLandId(long id) {
        return jdbcOperations.queryForObject(SQL_EXISTS_BY_LAND_ID, Long.class, id) > 0;
    }

    @Override
    public boolean exists(long landId, long customerId) {
        return jdbcOperations.queryForObject(SQL_EXISTS, Long.class, landId, customerId) > 0;
    }

    @Override
    public List<LandBuyDetail> findByCustomerId(long customerId) {
        return jdbcOperations.query(SQL_SELECT_BY_CUSTOMER_ID, ROW_MAPPER, customerId);
    }

    @Override
    public long countByLandId(long id) {
        return jdbcOperations.queryForObject(SQL_COUNT_BY_LAND_ID, Long.class, id);
    }
}
