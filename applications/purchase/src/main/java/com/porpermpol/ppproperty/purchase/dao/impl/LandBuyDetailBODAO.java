package com.porpermpol.ppproperty.purchase.dao.impl;

import com.nurkiewicz.jdbcrepository.sql.SqlGenerator;
import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

@Repository
public class LandBuyDetailBODAO extends JdbcDao implements ILandBuyDetailBODAO {

    private static final String SQL_SELECT_BY_LAND_ID = "SELECT lbd.*, concat(c.firstname, ' ', c.lastname) AS buyer_name " +
            "FROM land_buy_detail lbd INNER JOIN customer c ON lbd.customer_id = c.id " +
            "WHERE lbd.land_id = ?";

    private static final String SQL_COUNT_BY_LAND_ID = "SELECT count(*) FROM land_buy_detail WHERE land_id = ?";

    @Override
    public Page<LandBuyDetailBO> findByLandId(long id, Pageable pageable) {

        //TODO: use this for jasper report
//        JdbcTemplate template;
//        DataSourceUtils.getConnection(template.getDataSource());

        StringBuilder sb = new StringBuilder(SQL_SELECT_BY_LAND_ID);
        sb.append(limitClause(pageable));
        List < LandBuyDetailBO > landBuyDetailBOList = jdbcOperations.query(sb.toString(), ROW_MAPPER, id);
        long count = jdbcOperations.queryForObject(SQL_COUNT_BY_LAND_ID, Long.class, id);
        return new PageImpl<>(landBuyDetailBOList, pageable, count);
    }

    public static final RowMapper<LandBuyDetailBO> ROW_MAPPER = new RowMapper<LandBuyDetailBO>() {
        @Override
        public LandBuyDetailBO mapRow(ResultSet rs, int rowNum) throws SQLException {
            LandBuyDetailBO model = new LandBuyDetailBO();
            model.setId(rs.getLong("id"));
            model.setLandId(rs.getLong("land_id"));
            model.setBuyerName(rs.getString("buyer_name"));
            model.setBuyType(BuyType.get(rs.getString("buy_type")));
            model.setBuyPrice(rs.getFloat("buy_price"));
            model.setDownPayment((Float)rs.getObject("down_payment"));
            model.setAnnualInterest((Float)rs.getObject("annual_interest"));
            model.setYearsOfInstallment((Integer)rs.getObject("years_of_installment"));
            model.setDescription(rs.getString("description"));
            model.setArea(new Area(rs.getInt("rai"), rs.getInt("yarn"), rs.getInt("tarangwa")));
            model.setCreatedTime(new Date(rs.getLong("created_time")));
            return model;
        }
    };
}
