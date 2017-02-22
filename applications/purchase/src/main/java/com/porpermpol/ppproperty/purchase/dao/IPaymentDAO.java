package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface IPaymentDAO extends PagingAndSortingRepository<Payment, Long> {
    Page<Payment> findByLandBuyDetailId(long id, Pageable pageable);
    Float getDownPayment(long buyDetailId);
}
