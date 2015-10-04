package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.Installment;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface IInstallmentDAO extends PagingAndSortingRepository<Installment, Long> {
    List<Installment> findByLandBuyDetailId(long id);
}
