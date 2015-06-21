package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentRecordDAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.BuyType;
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
public class InstallmentRecordDAOIT {

    @Autowired
    private ILandDAO propertyDAO;

    @Autowired
    private ICustomerDAO customerDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    @Autowired
    private IInstallmentRecordDAO installmentRecordDAO;

    private InstallmentRecord installmentRecord;

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
        landBuyDetail.setPropertyId(Land.getId());
        landBuyDetail.setBuyPrice(10000f);
        landBuyDetail.setBuyType(BuyType.CASH);
        landBuyDetail.setAnnualInterest(15.5f);
        landBuyDetail.setDownPayment(1000f);
        landBuyDetail.setYearsOfInstallment(5);
        landBuyDetail.setCreatedBy(0L);
        landBuyDetail.setCreatedTime(new Date());
        buyDetailDAO.save(landBuyDetail);

        installmentRecord = new InstallmentRecord();
        installmentRecord.setBuyDetailId(landBuyDetail.getId());
        installmentRecord.setAmount(10000f);
        installmentRecord.setPayFor(new Date());
        installmentRecord.setDescription("description");
        installmentRecord.setCreatedBy(0L);
        installmentRecord.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.deleteAll();
        customerDAO.deleteAll();
        buyDetailDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {
        installmentRecordDAO.save(installmentRecord);
        assertNotNull(installmentRecord.getId());
        assertTrue(installmentRecord.isPersisted());
        assertEquals(1, installmentRecordDAO.count());
    }

    @Test
    public void testUpdate() throws Exception {
        installmentRecordDAO.save(installmentRecord);

        Float expected = 1f;

        installmentRecord.setAmount(expected);
        installmentRecord.setUpdatedBy(0L);
        installmentRecord.setUpdatedTime(new Date());

        installmentRecordDAO.save(installmentRecord);

        assertEquals(expected, installmentRecordDAO.findOne(installmentRecord.getId()).getAmount());
    }

    @Test
    public void testFindById() throws Exception {
        installmentRecordDAO.save(installmentRecord);
        InstallmentRecord model = installmentRecordDAO.findOne(installmentRecord.getId());

        assertEquals(installmentRecord.getId(), model.getId());
        assertEquals(installmentRecord.getAmount(), model.getAmount());
        assertEquals(installmentRecord.getPayFor(), model.getPayFor());
        assertEquals(installmentRecord.getBuyDetailId(), model.getBuyDetailId());
        assertEquals(installmentRecord.getDescription(), model.getDescription());
        assertEquals(installmentRecord.getCreatedBy(), model.getCreatedBy());
        assertEquals(installmentRecord.getCreatedTime(), model.getCreatedTime());
        assertEquals(installmentRecord.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(installmentRecord.getUpdatedTime(), model.getUpdatedTime());

    }

    @Test
    public void testFindByBuyDetailId() throws Exception {
        assertTrue(installmentRecordDAO.findByBuyDetailId(installmentRecord.getBuyDetailId()).isEmpty());
        installmentRecordDAO.save(installmentRecord);
        assertEquals(1, installmentRecordDAO.findByBuyDetailId(installmentRecord.getBuyDetailId()).size());
    }

    @Test
    public void testCount() throws Exception {
        assertEquals(0, installmentRecordDAO.count());
        installmentRecordDAO.save(installmentRecord);
        assertEquals(1, installmentRecordDAO.count());
    }
}