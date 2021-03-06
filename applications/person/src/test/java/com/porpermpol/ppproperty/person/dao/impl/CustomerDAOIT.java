package com.porpermpol.ppproperty.person.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/person-context.xml")
public class CustomerDAOIT {

    @Autowired
    private ICustomerDAO customerDAO;

    private Customer customer;

    @Before
    public void setUp() throws Exception {
        customer = new Customer();
        customer.setFirstName("firstname");
        customer.setLastName("lastname");
        customer.setAddress("address");
        customer.setTel("111");
        customer.setDescription("description");
        customer.setCreatedBy(0L);
        customer.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        customerDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {

        customerDAO.save(customer);

        assertNotNull(customer.getId());
        assertTrue(customer.isPersisted());
        assertEquals(1, customerDAO.count());
    }

    @Test
    public void testUpdate() throws Exception {
        customerDAO.save(customer);
        String expected = "new firstname";
        customer.setFirstName(expected);
        customer.setUpdatedBy(0L);
        customer.setUpdatedTime(new Date());

        customerDAO.save(customer);

        assertEquals(expected, customerDAO.findOne(customer.getId()).getFirstName());

    }

    @Test
    public void testFindById() throws Exception {

        customerDAO.save(customer);

        Customer model = customerDAO.findOne(customer.getId());

        assertEquals(customer.getId(), model.getId());
        assertEquals(customer.getFirstName(), model.getFirstName());
        assertEquals(customer.getLastName(), model.getLastName());
        assertEquals(customer.getAddress(), model.getAddress());
        assertEquals(customer.getTel(), model.getTel());
        assertEquals(customer.getDescription(), model.getDescription());
        assertEquals(customer.getCreatedBy(), model.getCreatedBy());
        assertEquals(customer.getCreatedTime(), model.getCreatedTime());
        assertEquals(customer.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(customer.getUpdatedTime(), model.getUpdatedTime());
    }

    @Test
    public void testFindByCriteria_firstname() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        customerDAO.save(customer);
        assertEquals(1, customerDAO.findByCriteria("first", null, null, null, pageable).getTotalElements());
    }

    @Test
    public void testFindByCriteria_lastname() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        customerDAO.save(customer);
        assertEquals(1, customerDAO.findByCriteria(null, "last", null, null, pageable).getTotalElements());
    }

    @Test
    public void testFindByCriteria_address() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        customerDAO.save(customer);
        assertEquals(1, customerDAO.findByCriteria(null, null, "addr", null, pageable).getTotalElements());
    }

    @Test
    public void testFindByCriteria_tel() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        customerDAO.save(customer);
        assertEquals(1, customerDAO.findByCriteria(null, null, null, "1", pageable).getTotalElements());
    }

    @Test
    public void testFindByCriteria() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        customerDAO.save(customer);
        assertEquals(1, customerDAO.findByCriteria("first", "last", "addr", "1", pageable).getTotalElements());
    }
}