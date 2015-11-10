package com.porpermpol.ppproperty.person.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
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

    @Override
    public void saveCustomer(Customer customer) {
        ModelUtils.setAuditFields(customer);
        customerDAO.save(customer);
    }

    @Override
    public void deleteById(long id) {
        customerDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Customer findById(long id) {
        return customerDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Customer> findByCriteria(String firstname, String lastname, String address, String tel, Pageable pageable) {
        return customerDAO.findByCriteria(firstname, lastname, address, tel, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public long count() {
        return customerDAO.count();
    }
}
