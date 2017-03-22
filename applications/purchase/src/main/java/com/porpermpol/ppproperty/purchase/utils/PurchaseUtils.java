package com.porpermpol.ppproperty.purchase.utils;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;

import java.util.HashMap;
import java.util.Map;

public class PurchaseUtils {

    private static Map<String, Float> getFinancialData(BuyType type, Float buyPrice, Float downPayment,
                                                Float annualInterest, Integer installmentMonths,
                                                Float accumulatedPayment) {
        Map<String, Float> map = new HashMap();
        if (type == BuyType.INSTALLMENT && installmentMonths != null && annualInterest != null) {

            float initialDebt = buyPrice - downPayment;
            float interest = initialDebt * (annualInterest / 100f) * (installmentMonths / 12f);
            float balanceOwed = initialDebt + interest;

            map.put("interest", interest);
            map.put("installmentPerMonth", balanceOwed / installmentMonths);
            map.put("buyPrice", buyPrice + interest);
            map.put("debt", balanceOwed - accumulatedPayment);
        } else {
            map.put("buyPrice", buyPrice);
            map.put("debt", buyPrice - downPayment - accumulatedPayment);
        }
        return map;
    }

    public static final Map<String, Float> getFinancialData(LandBuyDetailBO bo) {
        return getFinancialData(bo.getBuyType(), bo.getBuyPrice(), bo.getDownPayment(),
                bo.getAnnualInterest(), bo.getInstallmentMonths(), bo.getTotalPayment());
    }

    public static final Map<String, Float> getFinancialData(ReceiptBO bo) {
        return getFinancialData(bo.getBuyType(), bo.getBuyPrice(), bo.getDownPayment(),
                bo.getAnnualInterest(), bo.getInstallmentMonths(), bo.getAccPayment());
    }

}
