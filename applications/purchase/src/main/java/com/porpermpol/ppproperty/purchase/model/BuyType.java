package com.porpermpol.ppproperty.purchase.model;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

public enum BuyType {

    CASH("C"), INSTALLMENT("I");

    private static final Map<String, BuyType> LOOKUP = new HashMap<>();

    static {
        for (BuyType g : EnumSet.allOf(BuyType.class)) {
            LOOKUP.put(g.getCode(), g);
        }
    }

    private String code;

    private BuyType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static BuyType get(String code) {
        return LOOKUP.get(code);
    }

}
