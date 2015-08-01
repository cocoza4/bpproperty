package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.security.dao.IUserLoginDAO;
import com.porpermpol.ppproperty.security.model.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/userlogins")
public class UserLoginRestController {

    @Autowired
    private IUserLoginDAO userLoginDAO;

    @RequestMapping(method = RequestMethod.GET)
    public List<UserLogin> user() {
        return (List<UserLogin>)userLoginDAO.findAll();
    }

}
