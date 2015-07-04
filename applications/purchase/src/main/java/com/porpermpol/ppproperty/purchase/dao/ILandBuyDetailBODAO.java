package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ILandBuyDetailBODAO {

    Page<LandBuyDetailBO> findByLandId(long id, Pageable pageable);

}
