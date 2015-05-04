package com.porpermpol.ppproperty.person.service;

import com.porpermpol.ppproperty.person.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICustomerService {

    Customer findById(long id);
    Page<Customer> findByCriteria(String firstName, String lastName, String tel, Pageable pageable);
    Page<Customer> findAll(Pageable pageable);

}
