package com.porpermpol.ppproperty.property.dao.impl;

import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
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
@ContextConfiguration("classpath:spring/property-context.xml")
public class LandDAOTest {

    @Autowired
    private ILandDAO landDAO;

    private Land land;
    private Area area;

    @Before
    public void setUp() throws Exception {

        area = new Area(1, 2, 3);

        land = new Land();
        land.setName("name");
        land.setAddress("address");
        land.setDescription("description");
        land.setArea(area);
        land.setCreatedBy(0L);
        land.setCreatedTime(new Date());

    }

    @After
    public void tearDown() throws Exception {
        landDAO.deleteAll();
    }

    @Test
    public void testInsert() throws Exception {

        landDAO.save(land);

        assertNotNull(land.getId());
        assertTrue(land.isPersisted());
        assertEquals(1, landDAO.count());
    }

    @Test
    public void testUpdate() throws Exception {

        landDAO.save(land);

        String expected = "new name";

        land.setName(expected);
        land.setUpdatedBy(0L);
        land.setUpdatedTime(new Date());

        landDAO.save(land);

        assertEquals(expected, landDAO.findOne(land.getId()).getName());

    }

    @Test
    public void testUpdate_area() throws Exception {

        landDAO.save(land);

        Area expected = new Area(9, 9, 9);

        land.setArea(expected);
        land.setUpdatedBy(0L);
        land.setUpdatedTime(new Date());

        landDAO.save(land);

        Area returnedArea = landDAO.findOne(land.getId()).getArea();

        assertEquals(expected.getRai(), returnedArea.getRai());
        assertEquals(expected.getTarangwa(), returnedArea.getTarangwa());
        assertEquals(expected.getYarn(), returnedArea.getYarn());

    }

    @Test
    public void testFindById() throws Exception {

        landDAO.save(land);

        Land model = landDAO.findOne(land.getId());

        assertEquals(land.getId(), model.getId());
        assertEquals(land.getName(), model.getName());
        assertEquals(land.getDescription(), model.getDescription());
        assertEquals(land.getArea().getYarn(), model.getArea().getYarn());
        assertEquals(land.getArea().getRai(), model.getArea().getRai());
        assertEquals(land.getArea().getTarangwa(), model.getArea().getTarangwa());
        assertEquals(land.getCreatedBy(), model.getCreatedBy());
        assertEquals(land.getCreatedTime(), model.getCreatedTime());
        assertEquals(land.getUpdatedBy(), model.getUpdatedBy());
        assertEquals(land.getUpdatedTime(), model.getUpdatedTime());

    }
}