package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.RequestAttributesUtils;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.person.service.ICustomerService;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
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
@ContextConfiguration("classpath:spring/purchase-context.xml")
public class LandBuyServiceIT {

    private static final Long USER_LOGIN_ID = 1L;
    private static final Date CURRENT_DATE = new Date();

    @Autowired
    private ILandBuyService landBuyService;
    @Autowired
    private ILandService landService;
    @Autowired
    private ICustomerService customerService;

    private Customer customer;
    private Land land;
    private LandBuyDetail landBuyDetail;
    private Payment payment;

    @Before
    public void setUp() throws Exception {

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

        land = new Land();
        land.setName("porpermpol");
        land.setAddress("address");
        land.setArea(new Area(10, 2, 1));
        land.setDescription("description");
        landService.saveLand(land);

        customer = new Customer();
        customer.setFirstName("firstname");
        customer.setLastName("lastname");
        customer.setAddress("address");
        customer.setTel("tel");
        customerService.saveCustomer(customer);

        landBuyDetail = new LandBuyDetail();
        landBuyDetail.setArea(new Area(1, 2, 3));
        landBuyDetail.setCustomerId(customer.getId());
        landBuyDetail.setLandId(land.getId());
        landBuyDetail.setDownPayment(1000f);
        landBuyDetail.setBuyPrice(100000f);
        landBuyDetail.setBuyType(BuyType.CASH);
        landBuyDetail.setAnnualInterest(15.5f);
        landBuyDetail.setYearsOfInstallment(5);

        payment = new Payment();
        payment.setPayFor(new Date());
        payment.setAmount(200f);
        payment.setDescription("description");
    }

    @After
    public void tearDown() throws Exception {
        landService.deleteById(land.getId());
        customerService.deleteById(customer.getId());
    }

    @Test
    public void testSaveLandBuyDetail_newInstance() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);

        assertNotNull(landBuyDetail.getId());
        assertTrue(landBuyDetail.isPersisted());

        LandBuyDetail returnLandBuyDetail = landBuyService.findLandBuyDetailById(landBuyDetail.getId());
        assertEquals(USER_LOGIN_ID, returnLandBuyDetail.getCreatedBy());
        assertEquals(CURRENT_DATE, returnLandBuyDetail.getCreatedTime());
    }

    @Test
    public void testSaveLandBuyDetail_update() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);

        Float expected = 20f;
        landBuyDetail.setAnnualInterest(expected);
        landBuyService.saveLandBuyDetail(landBuyDetail);

        LandBuyDetail returnLandBuyDetail = landBuyService.findLandBuyDetailById(landBuyDetail.getId());
        assertEquals(expected, returnLandBuyDetail.getAnnualInterest());

        assertEquals(USER_LOGIN_ID, returnLandBuyDetail.getUpdatedBy());
        assertEquals(CURRENT_DATE, returnLandBuyDetail.getUpdatedTime());
    }

    @Test
    public void testSaveInstallment_newInstance() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);
        payment.setBuyDetailId(landBuyDetail.getId());
        landBuyService.savePayment(payment);

        assertNotNull(payment.getId());
        assertTrue(payment.isPersisted());

        Payment returnPayment = landBuyService.findPaymentById(payment.getId());
        assertEquals(USER_LOGIN_ID, returnPayment.getCreatedBy());
        assertEquals(CURRENT_DATE, returnPayment.getCreatedTime());
    }

    @Test
    public void testDeleteLandBuyDetailById() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);
        payment.setBuyDetailId(landBuyDetail.getId());
        landBuyService.savePayment(payment);

        landBuyService.deleteLandBuyDetailById(landBuyDetail.getId());
        assertNull(landBuyService.findLandBuyDetailById(landBuyDetail.getId()));
        assertNull(landBuyService.findPaymentById(payment.getId()));
    }

    @Test
    public void testSaveInstallment_update() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);
        payment.setBuyDetailId(landBuyDetail.getId());
        landBuyService.savePayment(payment);

        Float expected = 20f;
        payment.setAmount(expected);
        landBuyService.savePayment(payment);

        Payment returnPayment = landBuyService.findPaymentById(payment.getId());
        assertEquals(expected, returnPayment.getAmount());
        assertEquals(USER_LOGIN_ID, returnPayment.getUpdatedBy());
        assertEquals(CURRENT_DATE, returnPayment.getUpdatedTime());
    }
}