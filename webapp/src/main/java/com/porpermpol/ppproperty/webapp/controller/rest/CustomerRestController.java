package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/customer")
public class CustomerRestController {

    @Autowired
    private ICustomerDAO customerDAO;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Customer getById(@PathVariable("id") long id) {

        Customer customer = customerDAO.findOne(id);
        if (customer == null) {
            throw new ResourceNotFoundException();
        }
        return customer;
    }

    @RequestMapping(method = RequestMethod.GET)
    public DataTableObject<Customer> getAll(@RequestParam(value = "page", defaultValue = "0") int page,
                                  @RequestParam(value = "length", defaultValue = "10") int length) {

        Pageable pageRequest = new PageRequest(page, length);
        Page<Customer> customerPage = customerDAO.findAll(pageRequest);

        DataTableObject<Customer> dataTableObject = new DataTableObject(customerPage.getContent(),
                                                                        customerPage.getContent().size(),
                                                                        customerPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(method = RequestMethod.POST)
    public void save(@RequestBody Customer customer) {

        System.out.println("SAVE NEW Customer: ");

        customer.setCreatedBy(0L);
        customer.setCreatedTime(new Date());

        customerDAO.save(customer);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable("id") long id, @RequestBody Customer customer) {

        System.out.println("UPDATE LAND: ");

        customer.setPersisted(true);
        customerDAO.save(customer);
    }

}
