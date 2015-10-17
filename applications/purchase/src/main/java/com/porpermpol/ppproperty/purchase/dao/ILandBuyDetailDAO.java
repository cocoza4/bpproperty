package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ILandBuyDetailDAO extends PagingAndSortingRepository<LandBuyDetail, Long> {

    boolean existsByLandId(long landId);
    boolean exists(long landId, long customerId);
    List<LandBuyDetail> findByCustomerId(long customerId);
    long countByLandId(long id);

}
