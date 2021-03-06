package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.purchase.utils.PurchaseUtils;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class LandBuyDetailBODAO extends JdbcDao implements ILandBuyDetailBODAO {

    private static final String SQL_GROUP_BY_CLAUSE = " GROUP BY lbd.id, buy_type, buyer_id, lbd.land_id, buy_price, " +
                "annual_interest, installment_months, lbd.description, rai, yarn, tarangwa, lbd.created_time, " +
                "down_payment, c.firstname, c.lastname";

    private static final String SQL_SELECT_ALL =
                "SELECT lbd.id, buy_type, c.id AS buyer_id, land_id, buy_price, annual_interest, " +
                        "installment_months, lbd.description, rai, yarn, tarangwa, lbd.created_time, " +
                        "(SELECT amount FROM payment WHERE is_down_payment = true AND buy_detail_id = lbd.id) AS down_payment, " +
                        "c.firstname, c.lastname, coalesce(sum(amount), 0) AS total_payment " +
                "FROM land_buy_detail lbd INNER JOIN customer c ON lbd.customer_id = c.id " +
                "LEFT JOIN (SELECT amount, buy_detail_id FROM payment WHERE is_down_payment = false) p ON p.buy_detail_id = lbd.id";

    private static final String SQL_SELECT_BY_ID = SQL_SELECT_ALL + " WHERE lbd.id = ? " + SQL_GROUP_BY_CLAUSE;

    private static final String SQL_COUNT_BY_LAND_ID = "SELECT count(*) FROM land_buy_detail lbd";

    private Object[] buildSQLConditions(StringBuilder sql, BuyType buyType, String firstName, Long landId,
                                        Long customerId, Date filteredMonth, Date filteredYear) {

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
        if (customerId != null) {
            conditions.add("customer_id = ?");
            params.add(customerId);
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
    public LandBuyDetailBO findById(long id) {
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_BY_ID, ROW_MAPPER, id);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    @Override
    public Page<LandBuyDetailBO> findByCriteria(BuyType buyType, String firstName, Long landId, Long customerId,
                                                Date filteredMonth, Date filteredYear, Pageable pageable) {

        StringBuilder sql = new StringBuilder(SQL_SELECT_ALL);
        StringBuilder whereClause = new StringBuilder();
        Object[] params = this.buildSQLConditions(whereClause, buyType, firstName, landId, customerId, filteredMonth, filteredYear);
        sql.append(whereClause)
                .append(SQL_GROUP_BY_CLAUSE)
                .append(JdbcDao.sortingClauseIfRequired(pageable.getSort()))
                .append(JdbcDao.limitClause(pageable));
        List<LandBuyDetailBO> bos = jdbcTemplate.query(sql.toString(), ROW_MAPPER, params);
        long criteriaCount = this.countByCriteria(whereClause.toString(), firstName, params);

        return new PageImpl<>(bos, pageable, criteriaCount);
    }

    private long countByCriteria(String whereClause, String firstName, Object[] params) {
        StringBuilder sb = new StringBuilder(SQL_COUNT_BY_LAND_ID);
        if (!StringUtils.isEmpty(firstName)) {
            sb.append(" INNER JOIN customer c ON customer_id = c.id");
        }
        sb.append(whereClause);
        return jdbcTemplate.queryForObject(sb.toString(), Long.class, params);
    }

    private static final RowMapper<LandBuyDetailBO> ROW_MAPPER = new RowMapper<LandBuyDetailBO>() {
        @Override
        public LandBuyDetailBO mapRow(ResultSet rs, int rowNum) throws SQLException {
            LandBuyDetailBO model = new LandBuyDetailBO();
            model.setId(rs.getLong("id"));
            model.setLandId(rs.getLong("land_id"));
            model.setBuyerId(rs.getLong("buyer_id"));
            model.setBuyerFirstName(rs.getString("firstname"));
            model.setBuyerLastName(rs.getString("lastname"));
            model.setBuyPrice(rs.getFloat("buy_price"));
            model.setBuyType(BuyType.get(rs.getString("buy_type")));
            model.setDownPayment((Float)rs.getObject("down_payment"));
            model.setAnnualInterest((Float)rs.getObject("annual_interest"));
            model.setInstallmentMonths((Integer)rs.getObject("installment_months"));
            model.setTotalPayment((Float)rs.getObject("total_payment"));
            model.setDescription(rs.getString("description"));
            model.setArea(new Area(rs.getInt("rai"), rs.getInt("yarn"), rs.getInt("tarangwa")));
            model.setCreatedTime(new Date(rs.getLong("created_time")));

            if (model.getDownPayment() == null) {
                model.setDownPayment(0f);
            }

            Map<String, Float> map = PurchaseUtils.getFinancialData(model);
            model.setBuyPrice(map.get("buyPrice")); // reset buyPrice with interest
            model.setInterest(map.get("interest"));
            model.setInstallmentPerMonth(map.get("installmentPerMonth"));
            model.setDebt(map.get("debt"));

            return model;
        }
    };
}
