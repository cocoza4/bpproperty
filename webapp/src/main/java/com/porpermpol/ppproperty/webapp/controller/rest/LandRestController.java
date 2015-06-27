package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
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
@RequestMapping("api/land")
public class LandRestController {

    @Autowired
    private ILandService landService;

    @Autowired
    private ILandBuyService landBuyService;

    // unable to perform init binder using @RequestBody
    @InitBinder("installmentRecord")
    public void initBinder(WebDataBinder binder) {
//        binder.registerCustomEditor(BuyType.class, new BuyTypePropertyEditor());
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

    @RequestMapping(value = "/{landId}/buyDetail", method = RequestMethod.GET)
    public DataTableObject<LandBuyDetail> getAllBuyDetails(@PathVariable("landId") long id,
                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                @RequestParam(value = "length", defaultValue = "10") int length) {

        Pageable pageRequest = new PageRequest(page, length);
        Page<LandBuyDetail> landBuyPage = landBuyService.findAllLandBuyDetails(pageRequest);

        DataTableObject<LandBuyDetail> dataTableObject = new DataTableObject<>(landBuyPage.getContent(),
                                                                            landBuyPage.getContent().size(),
                                                                            landBuyPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}", method = RequestMethod.GET)
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

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}/installmentsRecord", method = RequestMethod.GET)
    public List<InstallmentRecord> getInstallmentRecordsByBuyDetailId(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId) {

        return landBuyService.findInstallmentRecordsByLandBuyDetailId(buyDetailId);
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}/installmentsRecord", method = RequestMethod.POST)
    public void saveInstallmentRecord(@PathVariable("landId") long landId,
                                @PathVariable("buyDetailId") long buyDetailId,
                                @RequestBody InstallmentRecord installmentRecord) {

        landBuyService.saveInstallmentRecord(installmentRecord);
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}/installmentsRecord", method = RequestMethod.PUT)
    public void updateInstallmentRecord(@PathVariable("landId") long landId,
                                @PathVariable("buyDetailId") long buyDetailId,
                                @RequestBody InstallmentRecord installmentRecord) {
        installmentRecord.setPersisted(true);
        landBuyService.saveInstallmentRecord(installmentRecord);
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}/installmentsRecord/{installmentId}", method = RequestMethod.DELETE)
    public void deleteInstallmentRecord(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                  @PathVariable("installmentId") long installmentId) {
        landBuyService.deleteInstallmentRecordById(installmentId);
    }

    @RequestMapping(method = RequestMethod.POST)
    public void saveLand(@RequestBody Land land) {
        landService.saveLand(land);
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateLand(@PathVariable("landId") long landId, @RequestBody Land land) {
        land.setPersisted(true);
        landService.saveLand(land);
    }

    @RequestMapping(value = "/{landId}/buyDetail", method = RequestMethod.POST)
    public void saveBuyDetail(@PathVariable("landId") long landId, @RequestBody LandBuyDetail buyDetail) {
        landBuyService.saveLandBuyDetail(buyDetail);
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateBuyDetail(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                 @RequestBody LandBuyDetail buyDetail) {
        buyDetail.setPersisted(true);
        landBuyService.saveLandBuyDetail(buyDetail);
    }

}
