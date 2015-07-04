package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentDAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.Installment;
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
public class InstallmentDAOIT {

    @Autowired
    private ILandDAO propertyDAO;

    @Autowired
    private ICustomerDAO customerDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    @Autowired
    private IInstallmentDAO installmentDAO;

    private Installment installment;

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
        landBuyDetail.setBuyType(BuyType.CASH);
        landBuyDetail.setAnnualInterest(15.5f);
        landBuyDetail.setDownPayment(1000f);
        landBuyDetail.setYearsOfInstallment(5);
        landBuyDetail.setCreatedBy(0L);
        landBuyDetail.setCreatedTime(new Date());
        buyDetailDAO.save(landBuyDetail);

        installment = new Installment();
        installment.setBuyDetailId(landBuyDetail.getId());
        installment.setAmount(10000f);
        installment.setPayFor(new Date());
        installment.setDescription("description");
        installment.setCreatedBy(0L);
        installment.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.deleteAll();
        customerDAO.deleteAll();
        buyDetailDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {
        installmentDAO.save(installment);
        assertNotNull(installment.getId());
        assertTrue(installment.isPersisted());
        assertEquals(1, installmentDAO.count());
    }

    @Test
    public void testUpdate() throws Exception {
        installmentDAO.save(installment);

        Float expected = 1f;

        installment.setAmount(expected);
        installment.setUpdatedBy(0L);
        installment.setUpdatedTime(new Date());

        installmentDAO.save(installment);

        assertEquals(expected, installmentDAO.findOne(installment.getId()).getAmount());
    }

    @Test
    public void testFindById() throws Exception {
        installmentDAO.save(installment);
        Installment model = installmentDAO.findOne(installment.getId());

        assertEquals(installment.getId(), model.getId());
        assertEquals(installment.getAmount(), model.getAmount());
        assertEquals(installment.getPayFor(), model.getPayFor());
        assertEquals(installment.getBuyDetailId(), model.getBuyDetailId());
        assertEquals(installment.getDescription(), model.getDescription());
        assertEquals(installment.getCreatedBy(), model.getCreatedBy());
        assertEquals(installment.getCreatedTime(), model.getCreatedTime());
        assertEquals(installment.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(installment.getUpdatedTime(), model.getUpdatedTime());

    }

    @Test
    public void testFindByLandBuyDetailId() throws Exception {
        assertTrue(installmentDAO.findByLandBuyDetailId(installment.getBuyDetailId()).isEmpty());
        installmentDAO.save(installment);
        assertEquals(1, installmentDAO.findByLandBuyDetailId(installment.getBuyDetailId()).size());
    }

    @Test
    public void testCount() throws Exception {
        assertEquals(0, installmentDAO.count());
        installmentDAO.save(installment);
        assertEquals(1, installmentDAO.count());
    }
}