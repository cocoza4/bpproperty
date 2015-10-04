package com.porpermpol.ppproperty.property.service.impl;

import com.porpermpol.ppproperty.core.utils.RequestAttributesUtils;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
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
@ContextConfiguration("classpath:spring/property-context.xml")
public class LandServiceIT {

    private static final Long USER_LOGIN_ID = 1L;
    private static final Date CURRENT_DATE = new Date();

    @Autowired
    private ILandService landService;

    private Land land;

    @Before
    public void setUp() throws Exception {

        land = new Land();
        land.setName("porpermpol");
        land.setAddress("address");
        land.setArea(new Area(10, 2, 1));
        land.setDescription("description");

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
        landService.deleteById(land.getId());
    }

    @Test
    public void testSaveLand_newLand() throws Exception {
        landService.saveLand(land);
        assertNotNull(land.getId());
        assertTrue(land.isPersisted());
        assertEquals(1, landService.count());

        Land returnLand = landService.findById(land.getId());
        assertEquals(USER_LOGIN_ID, returnLand.getCreatedBy());
        assertEquals(CURRENT_DATE, returnLand.getCreatedTime());
    }

    @Test
    public void testSaveLand_updateLand() throws Exception {
        landService.saveLand(land);

        String expected = "new address";
        land.setAddress(expected);
        landService.saveLand(land);

        Land returnLand = landService.findById(land.getId());
        assertEquals(expected, returnLand.getAddress());

        assertEquals(USER_LOGIN_ID, returnLand.getUpdatedBy());
        assertEquals(CURRENT_DATE, returnLand.getUpdatedTime());
    }
}