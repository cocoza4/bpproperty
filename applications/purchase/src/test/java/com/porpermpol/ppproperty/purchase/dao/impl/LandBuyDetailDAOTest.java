package com.porpermpol.ppproperty.purchase.dao.impl;

import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
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
public class LandBuyDetailDAOTest {

    @Autowired
    private ICustomerDAO customerDAO;

    @Autowired
    private ILandDAO propertyDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    private LandBuyDetail landBuyDetail;

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

        landBuyDetail = new LandBuyDetail();
        landBuyDetail.setArea(new Area(1, 2, 3));
        landBuyDetail.setCustomerId(customer.getId());
        landBuyDetail.setPropertyId(Land.getId());
        landBuyDetail.setDownPayment(1000f);
        landBuyDetail.setBuyPrice(100000f);
        landBuyDetail.setBuyType(BuyType.CASH);
        landBuyDetail.setAnnualInterest(15f);
        landBuyDetail.setYearsOfInstallment(5);
        landBuyDetail.setCreatedBy(0L);
        landBuyDetail.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        propertyDAO.deleteAll();
        customerDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {
        buyDetailDAO.save(landBuyDetail);

        assertNotNull(landBuyDetail.getId());
        assertTrue(landBuyDetail.isPersisted());
        assertEquals(1, buyDetailDAO.count());
    }

    @Test
    public void testUpdate() throws Exception {

        buyDetailDAO.save(landBuyDetail);

        Integer expected = 1;

        landBuyDetail.setYearsOfInstallment(expected);
        landBuyDetail.setUpdatedBy(0L);
        landBuyDetail.setUpdatedTime(new Date());

        buyDetailDAO.save(landBuyDetail);

        assertEquals(expected, buyDetailDAO.findOne(landBuyDetail.getId()).getYearsOfInstallment());

    }

    @Test
    public void testFindById() throws Exception {

        buyDetailDAO.save(landBuyDetail);

        LandBuyDetail model = buyDetailDAO.findOne(landBuyDetail.getId());

        assertEquals(landBuyDetail.getId(), model.getId());
        assertEquals(landBuyDetail.getCustomerId(), model.getCustomerId());
        assertEquals(landBuyDetail.getPropertyId(), model.getPropertyId());
        assertEquals(landBuyDetail.getAnnualInterest(), model.getAnnualInterest());
        assertEquals(landBuyDetail.getYearsOfInstallment(), model.getYearsOfInstallment());
        assertEquals(landBuyDetail.getBuyType(), model.getBuyType());
        assertEquals(landBuyDetail.getBuyPrice(), model.getBuyPrice());
        assertEquals(landBuyDetail.getArea().getYarn(), model.getArea().getYarn());
        assertEquals(landBuyDetail.getArea().getRai(), model.getArea().getRai());
        assertEquals(landBuyDetail.getArea().getTarangwa(), model.getArea().getTarangwa());
        assertEquals(landBuyDetail.getCreatedBy(), model.getCreatedBy());
        assertEquals(landBuyDetail.getCreatedTime(), model.getCreatedTime());
        assertEquals(landBuyDetail.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(landBuyDetail.getUpdatedTime(), model.getUpdatedTime());
    }

    @Test
    public void testCount() throws Exception {
        assertEquals(0, buyDetailDAO.count());
        buyDetailDAO.save(landBuyDetail);
        assertEquals(1, buyDetailDAO.count());
    }
}