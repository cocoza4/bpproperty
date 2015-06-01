package com.porpermpol.ppproperty.webapp.controller.propertyEditor;

import com.porpermpol.ppproperty.purchase.model.BuyType;
import java.beans.PropertyEditorSupport;

// TODO: may delete this
public class BuyTypePropertyEditor extends PropertyEditorSupport {

    @Override
    public String getAsText() {
        System.out.println("xxxxxxxxx");
        BuyType buyType = (BuyType)getValue();
        if (buyType == BuyType.CASH)
            return "สด";
        else
            return "ผ่อน";
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        System.out.println("value = " + text);
        if (text.equals("สด")) {
            super.setValue(BuyType.CASH);
        } else {
            super.setValue(BuyType.INSTALLMENT);
        }

    }

}
