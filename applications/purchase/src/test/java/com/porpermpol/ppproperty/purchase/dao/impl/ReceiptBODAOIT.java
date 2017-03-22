package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.dao.IReceiptBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.ParseException;
import java.util.Date;

import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/purchase-context.xml")
public class ReceiptBODAOIT {

    @Autowired
    private ICustomerDAO customerDAO;

    @Autowired
    private ILandDAO propertyDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    @Autowired
    private ILandBuyDetailBODAO buyDetailBODAO;

    @Autowired
    private IPaymentDAO paymentDAO;

    @Autowired
    private IReceiptBODAO receiptBODAO;

    private Land land;
    private Customer customer;

    private Payment buildPayment(Long buyDetailId, float amount, boolean downPayment) {
        Payment payment = new Payment();
        payment.setBuyDetailId(buyDetailId);
        payment.setPayFor(new Date());
        payment.setAmount(amount);
        payment.setIsDownPayment(downPayment);
        payment.setDescription("description");
        payment.setCreatedBy(1L);
        payment.setCreatedTime(new Date());
        return payment;
    }

    private LandBuyDetail buildLandBuyDetail(Long landId, Long customerId, BuyType type, Float buyPrice,
                                             Float annualInterest, Integer installmentMonths) throws ParseException {
        LandBuyDetail model = new LandBuyDetail();
        model.setArea(new Area(1, 2, 3));
        model.setCustomerId(customerId);
        model.setLandId(landId);
        model.setBuyPrice(buyPrice);
        model.setBuyType(type);
        model.setAnnualInterest(annualInterest);
        model.setInstallmentMonths(installmentMonths);
        model.setCreatedBy(0L);
        model.setCreatedTime(new Date());
        return model;
    }

    @Before
    public void setUp() throws Exception {

        land = new Land();
        land.setName("name");
        land.setAddress("address");
        land.setDescription("description");
        land.setArea(new Area(10, 20, 30));
        land.setCreatedBy(0L);
        land.setCreatedTime(new Date());
        propertyDAO.save(land);

        customer = new Customer();
        customer.setFirstName("firstname");
        customer.setLastName("lastname");
        customer.setAddress("address");
        customer.setTel("111");
        customer.setCreatedBy(0L);
        customer.setCreatedTime(new Date());
        customerDAO.save(customer);
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.delete(land);
        customerDAO.delete(customer);
    }

    @Test
    public void findReceiptById_cash() throws Exception {
        LandBuyDetail cashBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.CASH, 100000f, null, null);
        buyDetailDAO.save(cashBuyDetail);

        Payment cash = this.buildPayment(cashBuyDetail.getId(), 100000f, false);
        paymentDAO.save(cash);

        ReceiptBO bo = receiptBODAO.findReceiptById(cashBuyDetail.getId(), cash.getId());
        this.assertBO(bo, cashBuyDetail, 100000f, 0f, 0f,
                100000f, null);
    }

    @Test
    public void findReceiptById_cash_withDownPayment() throws Exception {
        LandBuyDetail cashBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.CASH, 100000f, null, null);
        buyDetailDAO.save(cashBuyDetail);

        Payment cash1 = this.buildPayment(cashBuyDetail.getId(), 50000f, true);
        paymentDAO.save(cash1);

        Payment cash2 = this.buildPayment(cashBuyDetail.getId(), 50000f, false);
        paymentDAO.save(cash2);

        ReceiptBO bo = receiptBODAO.findReceiptById(cashBuyDetail.getId(), cash2.getId());
        this.assertBO(bo, cashBuyDetail, 100000f, 50000f, 0f,
                50000f, null);
    }

    @Test
    public void findReceiptById_installment_noPreviousPayment() throws Exception {
        LandBuyDetail installmentBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.INSTALLMENT, 100000f, 8f, 12);
        buyDetailDAO.save(installmentBuyDetail);

        Payment installment = this.buildPayment(installmentBuyDetail.getId(), 50000f, true);
        paymentDAO.save(installment);

        ReceiptBO bo = receiptBODAO.findReceiptById(installmentBuyDetail.getId(), installment.getId());
        this.assertBO(bo, installmentBuyDetail, 104000f, 50000f,
                0f, 54000f, 4500f);
    }

    @Test
    public void findReceiptById_installment_onePreviousPayment() throws Exception {
        LandBuyDetail installmentBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.INSTALLMENT, 850000f, 8f, 30);
        buyDetailDAO.save(installmentBuyDetail);

        Payment installment1 = this.buildPayment(installmentBuyDetail.getId(), 480000f, true);
        paymentDAO.save(installment1);

        Payment installment2 = this.buildPayment(installmentBuyDetail.getId(), 10000f, false);
        paymentDAO.save(installment2);

        ReceiptBO bo = receiptBODAO.findReceiptById(installmentBuyDetail.getId(), installment2.getId());
        this.assertBO(bo, installmentBuyDetail, 924000f, 480000f,
                0f, 444000f, 14800f);
    }

    @Test
    public void findReceiptById_installment_twoPreviousPayments() throws Exception {
        LandBuyDetail installmentBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.INSTALLMENT, 850000f, 8f, 30);
        buyDetailDAO.save(installmentBuyDetail);

        Payment installment1 = this.buildPayment(installmentBuyDetail.getId(), 480000f, true);
        paymentDAO.save(installment1);

        Payment installment2 = this.buildPayment(installmentBuyDetail.getId(), 10000f, false);
        paymentDAO.save(installment2);

        Payment installment3 = this.buildPayment(installmentBuyDetail.getId(), 10000f, false);
        paymentDAO.save(installment3);

        ReceiptBO bo = receiptBODAO.findReceiptById(installmentBuyDetail.getId(), installment3.getId());
        this.assertBO(bo, installmentBuyDetail, 924000f, 480000f,
                10000f, 434000f, 14800f);
    }

    @Test
    public void findReceiptById_installment_twoPreviousPayments_selectSecondLatestPayment() throws Exception {
        LandBuyDetail installmentBuyDetail = this.buildLandBuyDetail(land.getId(), customer.getId(),
                BuyType.INSTALLMENT, 850000f, 8f, 30);
        buyDetailDAO.save(installmentBuyDetail);

        Payment installment1 = this.buildPayment(installmentBuyDetail.getId(), 480000f, true);
        paymentDAO.save(installment1);

        Payment installment2 = this.buildPayment(installmentBuyDetail.getId(), 10000f, false);
        paymentDAO.save(installment2);

        Payment installment3 = this.buildPayment(installmentBuyDetail.getId(), 10000f, false);
        paymentDAO.save(installment3);

        ReceiptBO bo = receiptBODAO.findReceiptById(installmentBuyDetail.getId(), installment2.getId());
        this.assertBO(bo, installmentBuyDetail, 924000f, 480000f,
                0f, 444000f, 14800f);
    }

    private void assertBO(ReceiptBO bo, LandBuyDetail landBuyDetail, Float buyPrice,
                          Float downPayment, Float accPayment, Float debt, Float installmentPerMonth) {
        assertEquals(land.getName(), bo.getLandName());
        assertEquals(landBuyDetail.getId(), bo.getLandBuyDetailId());
        assertEquals(landBuyDetail.getBuyType(), bo.getBuyType());
        assertEquals(customer.getFirstName(), bo.getBuyerFirstName());
        assertEquals(customer.getLastName(), bo.getBuyerLastName());
        assertEquals(customer.getTel(), bo.getBuyerTel());
        assertEquals(customer.getAddress(), bo.getBuyerAddress());
        assertEquals(downPayment, bo.getDownPayment());
        assertEquals(buyPrice, bo.getBuyPrice());
        assertEquals(landBuyDetail.getAnnualInterest(), bo.getAnnualInterest());
        assertEquals(landBuyDetail.getInstallmentMonths(), bo.getInstallmentMonths());
        assertEquals(installmentPerMonth, bo.getInstallmentPerMonth());
        assertEquals(accPayment, bo.getAccPayment());
        assertEquals(debt, bo.getDebt());
    }

}