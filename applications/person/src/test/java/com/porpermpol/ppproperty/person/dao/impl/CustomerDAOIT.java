package com.porpermpol.ppproperty.person.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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
        assertEquals(customer.getCreatedBy(), model.getCreatedBy());
        assertEquals(customer.getCreatedTime(), model.getCreatedTime());
        assertEquals(customer.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(customer.getUpdatedTime(), model.getUpdatedTime());

    }
}