package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.RequestAttributesUtils;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import mockit.Mock;
import mockit.MockUp;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

import static org.junit.Assert.*;

public class LandBuyServiceIT {

    private static final Long USER_LOGIN_ID = 1L;
    private static final Date CURRENT_DATE = new Date();

    @Autowired
    private ILandBuyService landBuyService;
    @Autowired
    private ILandService landService;

    private Land land;
    private LandBuyDetail landBuyDetail;
    private InstallmentRecord installmentRecord;

    @Before
    public void setUp() throws Exception {

        land = new Land();
        land.setName("porpermpol");
        land.setAddress("address");
        land.setArea(new Area(10, 2, 1));
        land.setDescription("description");
        landService.saveLand(land);

        landBuyDetail = new LandBuyDetail();
//        landBuyDetail.set


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

    }

    @Test
    public void testSaveLandBuyDetail() throws Exception {

    }

    @Test
    public void testFindLandBuyDetailByCriteria() throws Exception {

    }

    @Test
    public void testSaveInstallmentRecord() throws Exception {

    }
}