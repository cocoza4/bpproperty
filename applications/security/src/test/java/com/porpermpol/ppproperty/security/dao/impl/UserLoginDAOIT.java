package com.porpermpol.ppproperty.security.dao.impl;

import com.porpermpol.ppproperty.security.dao.IUserLoginDAO;
import com.porpermpol.ppproperty.security.model.UserLogin;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/security-context.xml")
public class UserLoginDAOIT {

    @Autowired
    private IUserLoginDAO userLoginDAO;

    private UserLogin userLogin;

    @Before
    public void setUp() throws Exception {

        userLogin = new UserLogin();
        userLogin.setUsername("username");
        userLogin.setPassword("password");
        userLogin.setCreatedBy(1L);
        userLogin.setCreatedTime(new Date());
    }

    @After
    public void tearDown() throws Exception {
        userLoginDAO.deleteAll();
    }

    @Test(expected = DuplicateKeyException.class)
    public void testSave_duplicateUsername() throws Exception {
        userLoginDAO.save(userLogin);
        userLogin.setPersisted(false);
        userLoginDAO.save(userLogin);
    }

    @Test
    public void testSave() throws Exception {
        userLoginDAO.save(userLogin);
        assertNotNull(userLogin.getId());
        assertTrue(userLogin.isPersisted());
    }

    @Test
    public void testFindByUsername() throws Exception {
        userLoginDAO.save(userLogin);
        UserLogin model = userLoginDAO.findByUsername(userLogin.getUsername());
        assertEquals(userLogin.getId(), model.getId());
        assertEquals(userLogin.getUsername(), model.getUsername());
        assertEquals(userLogin.getPassword(), model.getPassword());
    }

    @Test
    public void testFindOne() throws Exception {
        userLoginDAO.save(userLogin);
        UserLogin model = userLoginDAO.findOne(userLogin.getId());
        assertEquals(userLogin.getId(), model.getId());
        assertEquals(userLogin.getUsername(), model.getUsername());
        assertEquals(userLogin.getPassword(), model.getPassword());
    }
}