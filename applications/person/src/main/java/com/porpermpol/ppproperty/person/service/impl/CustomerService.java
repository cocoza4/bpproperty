package com.porpermpol.ppproperty.person.service.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.person.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService implements ICustomerService {

    @Autowired
    private ICustomerDAO customerDAO;

    @Transactional(readOnly = true)
    @Override
    public Customer findById(long id) {
        return customerDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Customer> findByCriteria(String firstName, String lastName, String tel, Pageable pageable) {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return customerDAO.findAll(pageable);
    }
}
