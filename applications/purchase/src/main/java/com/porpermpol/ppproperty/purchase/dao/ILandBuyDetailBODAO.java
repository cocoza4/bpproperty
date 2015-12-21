package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayOutputStream;
import java.util.Date;

public interface ILandBuyDetailBODAO {
    LandBuyDetailBO findById(long id);
    ByteArrayOutputStream getReceipt(long buyDetailId, long customerId);
    Page<LandBuyDetailBO> findByCriteria(BuyType buyType, String firstName, Long landId, Long customerId,
                                         Date filteredMonth, Date filteredYear, Pageable pageable);
}
