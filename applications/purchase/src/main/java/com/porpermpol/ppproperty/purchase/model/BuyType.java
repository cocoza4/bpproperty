package com.porpermpol.ppproperty.purchase.model;

public enum BuyType {

    CASH("C"), INSTALLMENT("I");

    private String code;

    BuyType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static BuyType get(String code) {
        if (code.equals("C"))
            return BuyType.CASH;
        else
            return BuyType.INSTALLMENT;
    }

}
