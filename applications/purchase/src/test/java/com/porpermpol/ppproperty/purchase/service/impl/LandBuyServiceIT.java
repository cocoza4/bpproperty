package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.RequestAttributesUtils;
import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.person.service.ICustomerService;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;
import com.porpermpol.ppproperty.purchase.bo.ReceiptItemBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import mockit.Deencapsulation;
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

    @Autowired
    private IPaymentDAO paymentDAO;
    @Autowired
    private ICustomerDAO customerDAO;
    @Autowired
    private ILandDAO landDAO;

    @Autowired
    private ILandBuyDetailDAO landBuyDetailDAO;

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
        landBuyDetail.setBuyPrice(100000f);
        landBuyDetail.setBuyType(BuyType.CASH);
        landBuyDetail.setAnnualInterest(15.5f);
        landBuyDetail.setInstallmentMonths(5);

    }

    @After
    public void tearDown() throws Exception {
        landDAO.delete(land);
        customerDAO.delete(customer);
    }

    private Payment buildPayment(Long buyDetailId, float amount, boolean downPayment) {
        Payment payment = new Payment();
        payment.setBuyDetailId(buyDetailId);
        payment.setPayFor(new Date());
        payment.setAmount(amount);
        payment.setIsDownPayment(downPayment);
        payment.setDescription("description");
        return payment;
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
        Payment payment = this.buildPayment(landBuyDetail.getId(), 200f, true);
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
        Payment payment = this.buildPayment(landBuyDetail.getId(), 200f, true);
        landBuyService.savePayment(payment);

        landBuyService.deleteLandBuyDetailById(landBuyDetail.getId());
        assertNull(landBuyService.findLandBuyDetailById(landBuyDetail.getId()));
        assertNull(landBuyService.findPaymentById(payment.getId()));
    }

    @Test
    public void testSaveInstallment_update() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);
        Payment payment = this.buildPayment(landBuyDetail.getId(), 200f, true);
        landBuyService.savePayment(payment);

        Float expected = 20f;
        payment.setAmount(expected);
        landBuyService.savePayment(payment);

        Payment returnPayment = landBuyService.findPaymentById(payment.getId());
        assertEquals(expected, returnPayment.getAmount());
        assertEquals(USER_LOGIN_ID, returnPayment.getUpdatedBy());
        assertEquals(CURRENT_DATE, returnPayment.getUpdatedTime());
    }

    @Test
    public void testGetReceipt() throws Exception {
        landBuyService.saveLandBuyDetail(landBuyDetail);
        Payment payment = this.buildPayment(landBuyDetail.getId(), 200f, true);
        landBuyService.savePayment(payment);
        assertNotNull(landBuyService.getReceipt(landBuyDetail.getId(), payment.getId()));
    }

    @Test
    public void testGetReceipt_invalidReceiptId() throws Exception {

        LandBuyDetail model = new LandBuyDetail();

        try {
            landBuyService.saveLandBuyDetail(landBuyDetail);
            Payment payment = this.buildPayment(landBuyDetail.getId(), 200f, true);
            landBuyService.savePayment(payment);

            model.setArea(new Area(1, 2, 3));
            model.setCustomerId(customer.getId());
            model.setLandId(land.getId());
            model.setBuyPrice(100000f);
            model.setBuyType(BuyType.CASH);
            model.setAnnualInterest(15.5f);
            model.setInstallmentMonths(5);
            landBuyService.saveLandBuyDetail(model);

            Payment anotherPayment = this.buildPayment(model.getId(), 200f, true);
            landBuyService.savePayment(anotherPayment);

            assertNull(landBuyService.getReceipt(landBuyDetail.getId(), anotherPayment.getId()));
        } finally {
            landBuyService.deleteLandBuyDetailById(model.getId());
        }
    }

    @Test
    public void testBuildReceiptItemBO_downPayment() throws Exception {
        LandBuyService service = new LandBuyService();

        ReceiptBO receiptBO = this.buildReceiptBO(50000f, 100000f, 1000f, 5000f);

        ReceiptItemBO bo = Deencapsulation.invoke(service, "buildReceiptItemBO", true, receiptBO);
        assertEquals(new Float(55000), bo.getDebt());
        assertEquals(new Float(1000f), bo.getAccumulatedPayment());
    }

    @Test
    public void testBuildReceiptItemBO_nonDownPayment() throws Exception {
        LandBuyService service = new LandBuyService();

        ReceiptBO receiptBO = this.buildReceiptBO(50000f, 100000f, 1000f, 5000f);

        ReceiptItemBO bo = Deencapsulation.invoke(service, "buildReceiptItemBO", false, receiptBO);
        assertEquals(new Float(5000f), bo.getDebt());
        assertEquals(new Float(51000), bo.getAccumulatedPayment());
    }

    private ReceiptBO buildReceiptBO(float downPayment, float buyPrice, float accPayment, float debt) {
        ReceiptBO bo = new ReceiptBO();
        bo.setLandName("name");
        bo.setBuyType(BuyType.INSTALLMENT);
        bo.setDownPayment(downPayment);
        bo.setBuyPrice(buyPrice);
        bo.setAccPayment(accPayment);
        bo.setDebt(debt);
        return bo;
    }
}