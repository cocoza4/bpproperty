package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
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

    public LandBuyDetailDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "LAND_BUY_DETAIL", "ID");
    }

    public static final RowMapper<LandBuyDetail> ROW_MAPPER = new RowMapper<LandBuyDetail>() {
        @Override
        public LandBuyDetail mapRow(ResultSet rs, int rowNum) throws SQLException {

            LandBuyDetail model = new LandBuyDetail();
            model.setId(rs.getLong("ID"));
            model.setPropertyId(rs.getLong("PROPERTY_ID"));
            model.setCustomerId(rs.getLong("CUSTOMER_ID"));
            model.setBuyType(BuyType.get(rs.getString("BUY_TYPE")));
            model.setBuyPrice(rs.getFloat("BUY_PRICE"));
            model.setAnnualInterest(rs.getInt("ANNUAL_INTEREST"));
            model.setYearsOfInstallment(rs.getInt("YEARS_OF_INSTALLMENT"));
            model.setDescription(rs.getString("DESCRIPTION"));
            model.setArea(new Area(rs.getInt("RAI"), rs.getInt("YARN"), rs.getInt("TARANGWA")));
            model.setCreatedBy(rs.getLong("CREATED_BY"));
            model.setCreatedTime(new Date(rs.getLong("CREATED_TIME")));
            model.setUpdatedBy(ModelUtils.getNullableLongField(rs, "UPDATED_BY"));
            model.setUpdatedTime(ModelUtils.getNullableDateField(rs, "UPDATED_TIME"));
            return model.withPersisted(true);
        }
    };

    private static final RowUnmapper<LandBuyDetail> ROW_UNMAPPER = new RowUnmapper<LandBuyDetail>() {
        @Override
        public Map<String, Object> mapColumns(LandBuyDetail model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("ID", model.getId());
            mapping.put("PROPERTY_ID", model.getPropertyId());
            mapping.put("CUSTOMER_ID", model.getCustomerId());
            mapping.put("BUY_TYPE", model.getBuyType().getCode());
            mapping.put("BUY_PRICE", model.getBuyPrice());
            mapping.put("ANNUAL_INTEREST", model.getAnnualInterest());
            mapping.put("YEARS_OF_INSTALLMENT", model.getYearsOfInstallment());
            mapping.put("DESCRIPTION", model.getDescription());

            mapping.put("RAI", model.getArea().getRai());
            mapping.put("YARN", model.getArea().getYarn());
            mapping.put("TARANGWA", model.getArea().getTarangwa());

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

    //TODO: complete this
    @Override
    public List<LandBuyDetail> findByCriteria(Long propertyId) {
        String sql = "SELECT * FROM LAND_PURCHASE_INFO WHERE PROPERTY_ID = ?";
//        return getjdbc;
        return null;
    }
}
