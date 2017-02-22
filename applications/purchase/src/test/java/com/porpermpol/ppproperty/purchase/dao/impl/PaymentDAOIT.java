package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
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
@ContextConfiguration("classpath:spring/purchase-context.xml")
public class PaymentDAOIT {

    @Autowired
    private ILandDAO propertyDAO;

    @Autowired
    private ICustomerDAO customerDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    @Autowired
    private IPaymentDAO paymentDAO;

    private Payment payment;
    private Payment payment1;

    @Before
    public void setUp() throws Exception {

        Land Land = new Land();
        Land.setName("name");
        Land.setAddress("address");
        Land.setDescription("description");
        Land.setArea(new Area(10, 20, 30));
        Land.setCreatedBy(0L);
        Land.setCreatedTime(new Date());
        propertyDAO.save(Land);

        Customer customer = new Customer();
        customer.setFirstName("firstname");
        customer.setLastName("lastname");
        customer.setAddress("address");
        customer.setTel("111");
        customer.setCreatedBy(0L);
        customer.setCreatedTime(new Date());
        customerDAO.save(customer);

        LandBuyDetail landBuyDetail = new LandBuyDetail();
        landBuyDetail.setArea(new Area(1, 2, 3));
        landBuyDetail.setCustomerId(customer.getId());
        landBuyDetail.setLandId(Land.getId());
        landBuyDetail.setBuyPrice(10000f);
        landBuyDetail.setBuyType(BuyType.INSTALLMENT);
        landBuyDetail.setAnnualInterest(15.5f);
        landBuyDetail.setInstallmentMonths(5);
        landBuyDetail.setCreatedBy(0L);
        landBuyDetail.setCreatedTime(new Date());
        buyDetailDAO.save(landBuyDetail);

        payment = new Payment();
        payment.setBuyDetailId(landBuyDetail.getId());
        payment.setAmount(10000f);
        payment.setIsDownPayment(true);
        payment.setPayFor(new Date());
        payment.setDescription("description");
        payment.setCreatedBy(0L);
        payment.setCreatedTime(new Date());

        payment = new Payment();
        payment.setBuyDetailId(landBuyDetail.getId());
        payment.setAmount(10000f);
        payment.setIsDownPayment(true);
        payment.setPayFor(new Date());
        payment.setDescription("description");
        payment.setCreatedBy(0L);
        payment.setCreatedTime(new Date());

        payment1 = new Payment();
        payment1.setBuyDetailId(landBuyDetail.getId());
        payment1.setAmount(50000f);
        payment1.setPayFor(new Date());
        payment1.setDescription("description");
        payment1.setCreatedBy(0L);
        payment1.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.deleteAll();
        customerDAO.deleteAll();
        buyDetailDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {
        paymentDAO.save(payment);
        assertNotNull(payment.getId());
        assertTrue(payment.isPersisted());
        assertEquals(1, paymentDAO.count());
    }

    @Test
    public void testInsertModelWithNulls() throws Exception {
        payment.setPayFor(null);
        paymentDAO.save(payment);
        assertNull(paymentDAO.findOne(payment.getId()).getPayFor());
    }

    @Test
    public void testUpdate() throws Exception {
        paymentDAO.save(payment);

        Float expected = 1f;

        payment.setAmount(expected);
        payment.setUpdatedBy(0L);
        payment.setUpdatedTime(new Date());

        paymentDAO.save(payment);
        assertEquals(expected, paymentDAO.findOne(payment.getId()).getAmount());
    }

    @Test
    public void testFindById() throws Exception {
        paymentDAO.save(payment);
        Payment model = paymentDAO.findOne(payment.getId());

        assertEquals(payment.getId(), model.getId());
        assertTrue(payment.isDownPayment());
        assertEquals(payment.getAmount(), model.getAmount());
        assertEquals(payment.getPayFor(), model.getPayFor());
        assertEquals(payment.getBuyDetailId(), model.getBuyDetailId());
        assertEquals(payment.getDescription(), model.getDescription());
        assertEquals(payment.getCreatedBy(), model.getCreatedBy());
        assertEquals(payment.getCreatedTime(), model.getCreatedTime());
        assertEquals(payment.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(payment.getUpdatedTime(), model.getUpdatedTime());
    }

    @Test
    public void testFindByLandBuyDetailId() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        assertEquals(0, paymentDAO.findByLandBuyDetailId(payment.getBuyDetailId(), pageable).getTotalElements());
        paymentDAO.save(payment);
        assertEquals(1, paymentDAO.findByLandBuyDetailId(payment.getBuyDetailId(), pageable).getTotalElements());
    }

    @Test
    public void testGetDownPayment() throws Exception {
        paymentDAO.save(payment);
        paymentDAO.save(payment1);
        Float actual = paymentDAO.getDownPayment(payment.getBuyDetailId());
        assertEquals(new Float(10000f), actual);
    }

    @Test
    public void testCount() throws Exception {
        assertEquals(0, paymentDAO.count());
        paymentDAO.save(payment);
        assertEquals(1, paymentDAO.count());
    }
}