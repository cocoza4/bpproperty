package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/purchase-context.xml")
public class LandBuyDetailBODAOIT {

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

    private DateFormat df = new SimpleDateFormat("yyyy/MM/dd");

    private Land land;
    private Customer customer;
    private LandBuyDetail cashLandBuyDetail;
    private LandBuyDetail installmentLandBuyDetail;

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

        cashLandBuyDetail = new LandBuyDetail();
        cashLandBuyDetail.setArea(new Area(1, 2, 3));
        cashLandBuyDetail.setCustomerId(customer.getId());
        cashLandBuyDetail.setLandId(land.getId());
        cashLandBuyDetail.setBuyPrice(100000f);
        cashLandBuyDetail.setBuyType(BuyType.CASH);
        cashLandBuyDetail.setCreatedBy(0L);
        cashLandBuyDetail.setCreatedTime(df.parse("2016/01/01"));
        buyDetailDAO.save(cashLandBuyDetail);

        installmentLandBuyDetail = new LandBuyDetail();
        installmentLandBuyDetail.setArea(new Area(1, 2, 3));
        installmentLandBuyDetail.setCustomerId(customer.getId());
        installmentLandBuyDetail.setLandId(land.getId());
        installmentLandBuyDetail.setDownPayment(1000f);
        installmentLandBuyDetail.setBuyPrice(100000f);
        installmentLandBuyDetail.setBuyType(BuyType.INSTALLMENT);
        installmentLandBuyDetail.setAnnualInterest(15.5f);
        installmentLandBuyDetail.setYearsOfInstallment(5);
        installmentLandBuyDetail.setCreatedBy(0L);
        installmentLandBuyDetail.setCreatedTime(df.parse("2015/02/11"));
        buyDetailDAO.save(installmentLandBuyDetail);

        Payment payment1 = new Payment();
        payment1.setBuyDetailId(installmentLandBuyDetail.getId());
        payment1.setAmount(10000f);
        payment1.setPayFor(new Date());
        payment1.setDescription("description");
        payment1.setCreatedBy(0L);
        payment1.setCreatedTime(new Date());
        paymentDAO.save(payment1);

        Payment payment2 = new Payment();
        payment2.setBuyDetailId(installmentLandBuyDetail.getId());
        payment2.setAmount(10000f);
        payment2.setPayFor(new Date());
        payment2.setDescription("description");
        payment2.setCreatedBy(0L);
        payment2.setCreatedTime(new Date());
        paymentDAO.save(payment2);
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.deleteAll();
        customerDAO.deleteAll();
        buyDetailDAO.deleteAll();
    }

    @Test
    public void testFindById() throws Exception {
        LandBuyDetailBO bo = buyDetailBODAO.findById(installmentLandBuyDetail.getId());
        this.assertLandBuyDetail(installmentLandBuyDetail, bo);
    }

    @Test
    public void testFindById_notFound() throws Exception {
        assertNull(buyDetailBODAO.findById(9999L));
    }

    @Test
    public void testFindByCriteria_FirstName() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, "first", null, null, null, null, pageable);
        assertEquals(2, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_FirstName_ThaiLanguage_support() throws Exception {
        customer.setFirstName("ทดสอบ");
        customerDAO.save(customer);
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, "ทด", null, null, null, null, pageable);
        assertEquals(2, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_BuyType_installment() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(BuyType.INSTALLMENT, null, null, null, null, null, pageable);
        assertEquals(1, bos.getTotalElements());
        LandBuyDetailBO bo = bos.getContent().get(0);
        assertEquals(new Float(20000f), bo.getTotalInstallment());
        this.assertLandBuyDetail(installmentLandBuyDetail, bo);
    }

    @Test
    public void testFindByCriteria_BuyType_cash() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(BuyType.CASH, null, null, null, null, null, pageable);
        assertEquals(1, bos.getTotalElements());
        LandBuyDetailBO bo = bos.getContent().get(0);
        assertEquals(new Float(0), bo.getTotalInstallment());
        this.assertLandBuyDetail(cashLandBuyDetail, bo);
    }

    @Test
    public void testFindByCriteria_LandId() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, land.getId(), null, null, null, pageable);
        assertEquals(2, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_CustomerId() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, customer.getId(), null, null, pageable);
        assertEquals(2, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedMonth_someDayWithinMonth() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, df.parse("2015/02/11"), null, pageable);
        assertEquals(1, bos.getTotalElements());
        LandBuyDetailBO bo = bos.getContent().get(0);
        assertEquals(new Float(20000f), bo.getTotalInstallment());
        this.assertLandBuyDetail(installmentLandBuyDetail, bo);
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedMonth_firstDayOfMonth() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, df.parse("2015/02/01"), null, pageable);
        assertEquals(1, bos.getTotalElements());
        LandBuyDetailBO bo = bos.getContent().get(0);
        assertEquals(new Float(20000f), bo.getTotalInstallment());
        this.assertLandBuyDetail(installmentLandBuyDetail, bo);
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedMonth_nonHappyPath() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, df.parse("2015/03/01"), null, pageable);
        assertEquals(0, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedYear_firstDayOfYear() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, null, df.parse("2015/01/01"), pageable);
        assertEquals(1, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedYear_lastDayOfYear() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, null, df.parse("2015/12/31"), pageable);
        assertEquals(1, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_validate_createdTime_within_specifiedYear_nonHappyPath() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(null, null, null, null, null, df.parse("2012/12/31"), pageable);
        assertEquals(0, bos.getTotalElements());
    }

    @Test
    public void testFindByCriteria_all() throws Exception {
        Pageable pageable = new PageRequest(0, 10);
        Page<LandBuyDetailBO> bos = buyDetailBODAO.findByCriteria(BuyType.INSTALLMENT, "first", land.getId(),
                customer.getId(), df.parse("2015/02/11"), null, pageable); // filtering by year is not supposed to use with by month
        assertEquals(1, bos.getTotalElements());
        this.assertLandBuyDetail(installmentLandBuyDetail, bos.getContent().get(0));
    }

    @Test
    public void testGetReceipt() throws Exception {
        assertNotNull(buyDetailBODAO.getReceipt(cashLandBuyDetail.getId(), cashLandBuyDetail.getCustomerId()));
    }

    private void assertLandBuyDetail(LandBuyDetail expected, LandBuyDetailBO actual) {
        Area area = expected.getArea();
        assertEquals(expected.getId(), actual.getId());
        assertEquals(expected.getLandId(), actual.getLandId());
        assertEquals(expected.getCustomerId(), actual.getBuyerId());
        assertEquals(expected.getAnnualInterest(), actual.getAnnualInterest());
        assertEquals(area.getRai(), actual.getArea().getRai());
        assertEquals(area.getYarn(), actual.getArea().getYarn());
        assertEquals(area.getTarangwa(), actual.getArea().getTarangwa());
        assertEquals(expected.getBuyPrice(), actual.getBuyPrice());
        assertEquals(expected.getDescription(), actual.getDescription());
        assertEquals(expected.getBuyType(), actual.getBuyType());
        assertEquals(expected.getDownPayment(), actual.getDownPayment());
        assertEquals(expected.getYearsOfInstallment(), actual.getYearsOfInstallment());
        assertEquals(customer.getFirstName(), actual.getBuyerFirstName());
        assertEquals(customer.getLastName(), actual.getBuyerLastName());
        assertEquals(expected.getCreatedTime(), actual.getCreatedTime());
    }
}