package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.person.service.ICustomerService;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/customers")
public class CustomerRestController {

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private ILandBuyService landBuyService;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Customer getById(@PathVariable("id") long id) {

        Customer customer = customerService.findById(id);
        if (customer == null) {
            throw new ResourceNotFoundException();
        }
        return customer;
    }

    @RequestMapping(method = RequestMethod.GET)
    public DataTableObject<Customer> getAll(@RequestParam(value = "firstname", required = false) String firstname,
                                            @RequestParam(value = "lastname", required = false) String lastname,
                                            @RequestParam(value = "address", required = false) String address,
                                            @RequestParam(value = "tel", required = false) String tel,
                                            @RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "length", defaultValue = "50") int length) {

        Pageable pageRequest = new PageRequest(page, length, Sort.Direction.ASC, "id");
        Page<Customer> customerPage = customerService.findByCriteria(firstname, lastname, address, tel, pageRequest);

        DataTableObject<Customer> dataTableObject = new DataTableObject<>(customerPage.getContent(),
                                                                        customerPage.getContent().size(),
                                                                        customerPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(method = RequestMethod.POST)
    public Customer save(@RequestBody Customer customer) {
        customerService.saveCustomer(customer);
        return customer;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable("id") long id, @RequestBody Customer customer) {
        customer.setPersisted(true);
        customerService.saveCustomer(customer);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") long id) {
        customerService.deleteById(id);
    }

    @RequestMapping(value = "/{id}/lands", method = RequestMethod.GET)
    public DataTableObject<LandBuyDetailBO> getLandBuyDetailsByCustomerId(@PathVariable("id") long id,
                                                             @RequestParam(value = "buyType", required = false) String buyTypeCode,
                                                             @RequestParam(value = "page", defaultValue = "0") int page,
                                                             @RequestParam(value = "length", defaultValue = "50") int length) {

        Pageable pageRequest = new PageRequest(page, length, Sort.Direction.ASC, "id");
        BuyType buyType = buyTypeCode == null ? null : BuyType.get(buyTypeCode);

        Page<LandBuyDetailBO> landBuyPage = landBuyService.findLandBuyDetailBOByCriteria(buyType, null, null, id,
                null, null, pageRequest);

        DataTableObject<LandBuyDetailBO> dataTableObject = new DataTableObject<>(landBuyPage.getContent(),
                landBuyPage.getContent().size(),
                landBuyPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{id}/lands", method = RequestMethod.HEAD)
    public ResponseEntity existsByCustomerId(@PathVariable("id") long id) {
        if (landBuyService.existsLandBuyDetailByCustomerId(id)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

}
