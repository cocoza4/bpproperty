package com.porpermpol.ppproperty.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SpringMVCController {

    @RequestMapping(value="/bpproperty", method = RequestMethod.GET)
    public String printWelcome(ModelMap model) {
        System.out.println("FUCK");
        return "index.html";
    }

}
