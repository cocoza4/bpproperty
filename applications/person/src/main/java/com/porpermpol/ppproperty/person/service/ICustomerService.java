package com.porpermpol.ppproperty.person.service;

import com.porpermpol.ppproperty.person.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICustomerService {

    void saveCustomer(Customer customer);
    void deleteById(long id);
    Customer findById(long id);
    Page<Customer> findByCriteria(String firstname, String lastname, String address, String tel, Pageable pageable);
    long count();

}
