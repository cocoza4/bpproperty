package com.porpermpol.ppproperty.person.dao;

import com.porpermpol.ppproperty.person.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ICustomerDAO extends PagingAndSortingRepository<Customer, Long> {
    Page<Customer> findByCriteria(String firstname, String lastname, String address, String tel, Pageable pageable);
}
