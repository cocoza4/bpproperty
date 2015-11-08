package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Repository
public class LandBuyDetailBODAO extends JdbcDao implements ILandBuyDetailBODAO {

    private static final String SQL_GROUP_BY_CLAUSE = " GROUP BY lbd.id, buy_type, lbd.land_id, buy_price, " +
            "down_payment, annual_interest, years_of_installment, lbd.description, rai, yarn, tarangwa, lbd.created_time, " +
            "buyer_name";

    private static final String SQL_SELECT_BY_LAND_ID = "SELECT lbd.id, buy_type, land_id, buy_price, " +
            "down_payment, annual_interest, years_of_installment, lbd.description, rai, yarn, tarangwa, lbd.created_time, " +
            "concat(c.firstname, ' ', c.lastname) AS buyer_name, coalesce(sum(amount), 0) AS total_installment " +
            "FROM land_buy_detail lbd INNER JOIN customer c ON lbd.customer_id = c.id " +
            "LEFT JOIN installment ON buy_detail_id = lbd.id";

    private static final String SQL_COUNT_BY_LAND_ID = "SELECT count(*) FROM land_buy_detail lbd";

    private Object[] buildSQLConditions(StringBuilder sql, BuyType buyType, String firstName,
                                        Long landId, Date filteredMonth, Date filteredYear) {

        List<Object> params = new ArrayList<>();
        List<String> conditions = new ArrayList<>();

        if (buyType != null) {
            conditions.add("buy_type = ?");
            params.add(buyType.getCode());
        }
        if (!StringUtils.isEmpty(firstName)) {
            conditions.add("lower(firstname) LIKE ?");
            params.add(firstName.toLowerCase() + "%");
        }
        if (landId != null) {
            conditions.add("land_id = ?");
            params.add(landId);
        }
        if (filteredMonth != null) {
            Date firstDayOfMonth = DateUtils.truncate(filteredMonth, Calendar.MONTH);
            Date nextMonth = DateUtils.addMonths(firstDayOfMonth, 1);
            conditions.add("(lbd.created_time >= ? AND lbd.created_time < ?)"); // within a specified month of the year
            params.add(firstDayOfMonth.getTime());
            params.add(nextMonth.getTime());
        } else if (filteredYear != null) { // filtering by month and year is not supposed to use together
            Date firstDayOfYear = DateUtils.truncate(filteredYear, Calendar.YEAR);
            Date nextYear = DateUtils.addYears(firstDayOfYear, 1);
            conditions.add("(lbd.created_time >= ? AND lbd.created_time < ?)"); // within a specified year
            params.add(firstDayOfYear.getTime());
            params.add(nextYear.getTime());
        }

        if (!conditions.isEmpty()) {
            sql.append(" WHERE ")
                    .append(StringUtils.join(conditions, " AND "));
        }

        return params.toArray();
    }

    @Override
    public Page<LandBuyDetailBO> findByCriteria(BuyType buyType, String firstName, Long landId, Date filteredMonth,
                                                Date filteredYear, Pageable pageable) {

        StringBuilder sql = new StringBuilder(SQL_SELECT_BY_LAND_ID);
        StringBuilder whereClause = new StringBuilder();
        Object[] params = this.buildSQLConditions(whereClause, buyType, firstName, landId, filteredMonth, filteredYear);
        sql.append(whereClause)
                .append(SQL_GROUP_BY_CLAUSE)
                .append(sortingClauseIfRequired(pageable.getSort()))
                .append(limitClause(pageable));
        List<LandBuyDetailBO> bos = jdbcOperations.query(sql.toString(), ROW_MAPPER, params);
        long criteriaCount = this.countByCriteria(whereClause.toString(), firstName, params);

        return new PageImpl<>(bos, pageable, criteriaCount);
    }

    private long countByCriteria(String whereClause, String firstName, Object[] params) {
        StringBuilder sb = new StringBuilder(SQL_COUNT_BY_LAND_ID);
        if (!StringUtils.isEmpty(firstName)) {
            sb.append(" INNER JOIN customer c ON customer_id = c.id");
        }
        sb.append(whereClause);
        return jdbcOperations.queryForObject(sb.toString(), Long.class, params);
    }

        //TODO: use this for jasper report
//        JdbcTemplate template;
//        DataSourceUtils.getConnection(template.getDataSource());

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
            model.setTotalInstallment((Float)rs.getObject("total_installment"));
            model.setDescription(rs.getString("description"));
            model.setArea(new Area(rs.getInt("rai"), rs.getInt("yarn"), rs.getInt("tarangwa")));
            model.setCreatedTime(new Date(rs.getLong("created_time")));
            return model;
        }
    };
}
