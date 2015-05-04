package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/purchaseInfo")
public class PropertyPurchaseInfoRestController {

    @Autowired
    private ILandBuyDetailDAO propertyPurchaseInfoDAO;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public LandBuyDetail getById(@PathVariable("id") long id) {

        LandBuyDetail landBuyDetail = propertyPurchaseInfoDAO.findOne(id);
        if (landBuyDetail == null) {
            throw new ResourceNotFoundException();
        }
        return landBuyDetail;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<LandBuyDetail> getAll() {
        return (List<LandBuyDetail>) propertyPurchaseInfoDAO.findAll();
    }

}
