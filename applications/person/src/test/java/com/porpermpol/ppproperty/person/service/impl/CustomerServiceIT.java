package com.porpermpol.ppproperty.person.service.impl;

import com.porpermpol.ppproperty.core.utils.RequestAttributesUtils;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.person.service.ICustomerService;
import mockit.Mock;
import mockit.MockUp;
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
public class CustomerServiceIT {

    private static final Long USER_LOGIN_ID = 1L;
    private static final Date CURRENT_DATE = new Date();

    @Autowired
    private ICustomerService customerService;

    private Customer customer;

    @Before
    public void setUp() throws Exception {

        customer = new Customer();
        customer.setFirstName("firstname");
        customer.setLastName("lastname");
        customer.setAddress("address");
        customer.setTel("tel");

        new MockUp<RequestAttributesUtils>() {
            @Mock
            Date getCurrentTimestamp() {
                return CURRENT_DATE;
            }
            @Mock
            Long getUserLoginId() {
                return USER_LOGIN_ID;
            }
        };
    }

    @After
    public void tearDown() throws Exception {
        customerService.deleteById(customer.getId());
    }

    @Test
    public void testSaveCustomer_newCustomer() throws Exception {
        customerService.saveCustomer(customer);
        assertNotNull(customer.getId());
        assertTrue(customer.isPersisted());
        assertEquals(1, customerService.count());

        Customer returnCustomer = customerService.findById(customer.getId());
        assertEquals(USER_LOGIN_ID, returnCustomer.getCreatedBy());
        assertEquals(CURRENT_DATE, returnCustomer.getCreatedTime());
    }

    @Test
    public void testSaveCustomer_updateCustomer() throws Exception {
        customerService.saveCustomer(customer);

        String expected = "new address";
        customer.setAddress(expected);
        customerService.saveCustomer(customer);

        Customer returnCustomer = customerService.findById(customer.getId());
        assertEquals(expected, returnCustomer.getAddress());

        assertEquals(USER_LOGIN_ID, returnCustomer.getUpdatedBy());
        assertEquals(CURRENT_DATE, returnCustomer.getUpdatedTime());
    }

}