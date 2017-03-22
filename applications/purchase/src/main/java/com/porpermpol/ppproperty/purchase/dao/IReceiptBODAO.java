package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;

public interface IReceiptBODAO {
    ReceiptBO findReceiptById(long landBuyDetailId, long receiptId);
}
