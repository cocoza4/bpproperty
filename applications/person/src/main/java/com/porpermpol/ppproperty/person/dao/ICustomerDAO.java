package com.porpermpol.ppproperty.person.dao;

import com.porpermpol.ppproperty.person.model.Customer;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ICustomerDAO extends PagingAndSortingRepository<Customer, Long> {
}
