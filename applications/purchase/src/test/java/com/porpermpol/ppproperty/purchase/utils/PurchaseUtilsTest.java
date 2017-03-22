package com.porpermpol.ppproperty.purchase.utils;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.*;

public class PurchaseUtilsTest {

    private LandBuyDetailBO buildLandBuyDetailBO(BuyType type, Float buyPrice, Float downPayment, Float annualInterest,
                                                 Integer installmentMonths, Float totalPayment) {
        LandBuyDetailBO bo = new LandBuyDetailBO();
        bo.setBuyType(type);
        bo.setBuyPrice(buyPrice);
        bo.setDownPayment(downPayment);
        bo.setAnnualInterest(annualInterest);
        bo.setInstallmentMonths(installmentMonths);
        bo.setTotalPayment(totalPayment);
        return bo;
    }

    @Test
    public void getFinancialData_installment() throws Exception {
        LandBuyDetailBO bo = buildLandBuyDetailBO(BuyType.INSTALLMENT, 850000f, 480000f,
                8f, 30, 0f);

        Map<String, Float> map = PurchaseUtils.getFinancialData(bo);
        assertEquals(new Float(924000), map.get("buyPrice"));
        assertEquals(new Float(74000), map.get("interest"));
        assertEquals(new Float(14800), map.get("installmentPerMonth"));
        assertEquals(new Float(444000), map.get("debt"));
    }

    @Test
    public void getFinancialData_installment_noInstallmentPerMonth() throws Exception {
        LandBuyDetailBO bo = buildLandBuyDetailBO(BuyType.INSTALLMENT, 850000f, 480000f,
                8f, null, 0f);

        Map<String, Float> map = PurchaseUtils.getFinancialData(bo);
        assertEquals(new Float(850000), map.get("buyPrice"));
        assertNull(map.get("interest"));
        assertNull(map.get("installmentPerMonth"));
        assertEquals(new Float(370000f), map.get("debt"));
    }

    @Test
    public void getFinancialData_installment_noAnnualInterest() throws Exception {
        LandBuyDetailBO bo = buildLandBuyDetailBO(BuyType.INSTALLMENT, 850000f, 480000f,
                null, 30, 0f);

        Map<String, Float> map = PurchaseUtils.getFinancialData(bo);
        assertEquals(new Float(850000), map.get("buyPrice"));
        assertNull(map.get("interest"));
        assertNull(map.get("installmentPerMonth"));
        assertEquals(new Float(370000f), map.get("debt"));
    }

    @Test
    public void getFinancialData_cash() throws Exception {
        LandBuyDetailBO bo = buildLandBuyDetailBO(BuyType.CASH, 850000f, 480000f,
                null, null, 0f);

        Map<String, Float> map = PurchaseUtils.getFinancialData(bo);
        assertEquals(new Float(850000), map.get("buyPrice"));
        assertNull(map.get("interest"));
        assertNull(map.get("installmentPerMonth"));
        assertEquals(new Float(370000f), map.get("debt"));
    }

}