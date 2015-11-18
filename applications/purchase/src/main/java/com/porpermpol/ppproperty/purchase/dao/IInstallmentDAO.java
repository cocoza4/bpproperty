package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.Installment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface IInstallmentDAO extends PagingAndSortingRepository<Installment, Long> {
    Page<Installment> findByLandBuyDetailId(long id, Pageable pageable);
}
