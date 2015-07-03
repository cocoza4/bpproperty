package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ILandBuyDetailDAO extends PagingAndSortingRepository<LandBuyDetail, Long> {

    List<LandBuyDetail> findByCriteria(long landId);
    List<LandBuyDetail> findByCustomerId(long customerId);

}
