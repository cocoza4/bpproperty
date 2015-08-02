package com.porpermpol.ppproperty.webapp.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class UserRestController {

    @RequestMapping("/postlogin")
    public Principal login(Principal user) {
        return user; // TODO: don't return principal object. it exposes too much credentials details to the front end
    }

}
