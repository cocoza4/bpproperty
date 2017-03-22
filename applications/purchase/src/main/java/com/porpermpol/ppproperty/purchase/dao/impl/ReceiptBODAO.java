package com.porpermpol.ppproperty.purchase.dao.impl;


import com.porpermpol.ppproperty.core.jdbcrepository.extension.JdbcDao;
import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;
import com.porpermpol.ppproperty.purchase.dao.IReceiptBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.utils.PurchaseUtils;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

@Repository
public class ReceiptBODAO extends JdbcDao implements IReceiptBODAO {

    private static final String SQL_SELECT_RECEIPT =
        "SELECT lbd.id, buy_type, l.name, c.firstname, c.lastname, c.address, c.tel, buy_price, " +
                "annual_interest, installment_months, " +
                "(SELECT amount FROM payment " +
                        "WHERE is_down_payment = true AND buy_detail_id = lbd.id) AS down_payment, " +
                "(SELECT COALESCE(SUM(amount), 0) FROM payment " +
                        "WHERE is_down_payment = false AND buy_detail_id = lbd.id AND id < ?) AS acc_payment " +
                "FROM land l INNER JOIN land_buy_detail lbd ON l.id = lbd.land_id " +
                "INNER JOIN customer c ON lbd.customer_id = c.id " +
            "WHERE lbd.id = ?";

    @Override
    public ReceiptBO findReceiptById(long landBuyDetailId, long receiptId) {
        try {
            return jdbcTemplate.queryForObject(SQL_SELECT_RECEIPT, ROW_MAPPER, receiptId, landBuyDetailId);
        } catch (EmptyResultDataAccessException ex) {
            return null;
        }
    }

    private static final RowMapper<ReceiptBO> ROW_MAPPER = new RowMapper<ReceiptBO>() {

        @Override
        public ReceiptBO mapRow(ResultSet rs, int rowNum) throws SQLException {

            ReceiptBO bo = new ReceiptBO();
            bo.setLandBuyDetailId(rs.getLong("id"));
            bo.setLandName(rs.getString("name"));
            bo.setBuyerFirstName(rs.getString("firstname"));
            bo.setBuyerLastName(rs.getString("lastname"));
            bo.setBuyerTel(rs.getString("tel"));
            bo.setBuyerAddress(rs.getString("address"));
            bo.setBuyPrice(rs.getFloat("buy_price"));
            bo.setBuyType(BuyType.get(rs.getString("buy_type")));
            bo.setDownPayment((Float)rs.getObject("down_payment"));
            bo.setAnnualInterest((Float)rs.getObject("annual_interest"));
            bo.setInstallmentMonths((Integer)rs.getObject("installment_months"));
            bo.setAccPayment((Float)rs.getObject("acc_payment"));

            if (bo.getDownPayment() == null) {
                bo.setDownPayment(0f);
            }

            Map<String, Float> map = PurchaseUtils.getFinancialData(bo);
            bo.setBuyPrice(map.get("buyPrice")); // reset buyPrice with interest
            bo.setInterest(map.get("interest"));
            bo.setInstallmentPerMonth(map.get("installmentPerMonth"));
            bo.setDebt(map.get("debt"));

            return bo;
        }
    };

}
