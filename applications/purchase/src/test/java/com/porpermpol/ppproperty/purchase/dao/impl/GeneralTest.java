package com.porpermpol.ppproperty.purchase.dao.impl;

import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;

import java.util.Calendar;
import java.util.Date;

public class GeneralTest {

    @Test
    public void test() {

//        current: Sun Nov 08 22:51:50 ICT 2015
//        date: Fri Oct 30 12:45:13 ICT 2015
//        truncated: Sun Nov 01 00:00:00 ICT 2015
//        next month: Tue Dec 01 00:00:00 ICT 2015

        Date current = new Date();
        System.out.println("current: " + current);

        Date date = new Date(1446183913864l);
        System.out.println("date: " + date);

        Date truncated = DateUtils.truncate(current, Calendar.MONTH);
        System.out.println("truncated: " + truncated);

        Date nextMonth = DateUtils.addMonths(truncated, 1);
        System.out.println("next month: " + nextMonth);
    }

    @Test
    public void testYear() {

        Date current = new Date();
        System.out.println("current: " + current);

        Date date = new Date(1446183913864l);
        System.out.println("date: " + date);

        Date truncated = DateUtils.truncate(current, Calendar.YEAR);
        System.out.println("truncated: " + truncated);

        Date nextMonth = DateUtils.addYears(truncated, 1);
        System.out.println("next month: " + nextMonth);
    }

}
