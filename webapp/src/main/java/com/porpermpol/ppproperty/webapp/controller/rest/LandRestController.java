package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.Installment;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/lands")
public class LandRestController {

    @Autowired
    private ILandService landService;

    @Autowired
    private ILandBuyService landBuyService;

    @InitBinder("installment")
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Date.class, "payFor", new CustomDateEditor(
                new SimpleDateFormat("dd/MM/yyyy"), false));
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.GET)
    public Land getLandById(@PathVariable("landId") long id) {

        Land Land = landService.findById(id);
        if (Land == null) {
            throw new ResourceNotFoundException();
        }
        return Land;
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.DELETE)
    public void deleteLandById(@PathVariable("landId") long id) {
        landService.deleteById(id);
    }

    @RequestMapping(method = RequestMethod.GET)
    public DataTableObject<Land> getAllLands(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "length", defaultValue = "10") int length) {
        Pageable pageRequest = new PageRequest(page, length);
        Page<Land> landPage = landService.findAll(pageRequest);

        DataTableObject<Land> dataTableObject = new DataTableObject<>(landPage.getContent(),
                                                                landPage.getContent().size(),
                                                                landPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{landId}/buydetails", method = RequestMethod.GET)
    public DataTableObject<LandBuyDetailBO> getLandBuyDetailsBOByLandId(@PathVariable("landId") long id,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "length", defaultValue = "10") int length) {

        Pageable pageRequest = new PageRequest(page, length);
        Page<LandBuyDetailBO> landBuyPage = landBuyService.findLandBuyDetailBOByLandId(id, pageRequest);

        DataTableObject<LandBuyDetailBO> dataTableObject = new DataTableObject<>(landBuyPage.getContent(),
                                                                            landBuyPage.getContent().size(),
                                                                            landBuyPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{landId}/buydetails", method = RequestMethod.HEAD)
    public ResponseEntity existsLandBuyDetailsByLandId(@PathVariable("landId") long id) {
        if (landBuyService.existsLandBuyDetailByLandId(id)) {
            return new ResponseEntity(HttpStatus.OK);
        }
        return new ResponseEntity(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}", method = RequestMethod.GET)
    public LandBuyDetail getBuyDetailById(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId,
                                          @RequestParam(value = "page", defaultValue = "0") int page,
                                          @RequestParam(value = "length", defaultValue = "10") int length) {

        LandBuyDetail buyDetail = landBuyService.findLandBuyDetailById(buyDetailId);
        if (buyDetail == null) {
            throw new ResourceNotFoundException();
        }
        return buyDetail;
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}", method = RequestMethod.DELETE)
    public void deleteBuyDetailById(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId) {
        landBuyService.deleteLandBuyDetailById(buyDetailId);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/installments", method = RequestMethod.GET)
    public List<Installment> getInstallmentsByBuyDetailId(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId) {

        return landBuyService.findInstallmentsByLandBuyDetailId(buyDetailId);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/installments", method = RequestMethod.POST)
    public void saveInstallment(@PathVariable("landId") long landId,
                                @PathVariable("buyDetailId") long buyDetailId,
                                @RequestBody Installment installment) {

        landBuyService.saveInstallment(installment);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/installments", method = RequestMethod.PUT)
    public void updateInstallment(@PathVariable("landId") long landId,
                                @PathVariable("buyDetailId") long buyDetailId,
                                @RequestBody Installment installment) {
        installment.setPersisted(true);
        landBuyService.saveInstallment(installment);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/installments/{installmentId}", method = RequestMethod.DELETE)
    public void deleteInstallment(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                  @PathVariable("installmentId") long installmentId) {
        landBuyService.deleteInstallmentById(installmentId);
    }

    @RequestMapping(method = RequestMethod.POST)
    public Land saveLand(@RequestBody Land land) {
        landService.saveLand(land);
        return land;
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateLand(@PathVariable("landId") long landId, @RequestBody Land land) {
        land.setPersisted(true);
        landService.saveLand(land);
    }

    @RequestMapping(value = "/{landId}/buydetails", method = RequestMethod.POST)
    public LandBuyDetail saveBuyDetail(@PathVariable("landId") long landId, @RequestBody LandBuyDetail buyDetail) {
        landBuyService.saveLandBuyDetail(buyDetail);
        return buyDetail;
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}", method = RequestMethod.PUT)
    public void updateBuyDetail(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                 @RequestBody LandBuyDetail buyDetail) {
        buyDetail.setPersisted(true);
        landBuyService.saveLandBuyDetail(buyDetail);
    }

}
