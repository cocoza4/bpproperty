package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("api/lands")
public class LandRestController {

    @Autowired
    private ILandService landService;

    @Autowired
    private ILandBuyService landBuyService;

    @InitBinder("payment")
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Date.class, "payFor", new CustomDateEditor(
                new SimpleDateFormat("dd/MM/yyyy"), true));
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.GET)
    public Land getLandById(@PathVariable("landId") long id) {

        Land land = landService.findById(id);
        if (land == null) {
            throw new ResourceNotFoundException();
        }
        return land;
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.DELETE)
    public void deleteLandById(@PathVariable("landId") long id) {
        landService.deleteById(id);
    }

    @RequestMapping(method = RequestMethod.GET)
    public DataTableObject<Land> getAllLands(@RequestParam(value = "page", defaultValue = "0") int page,
                                             @RequestParam(value = "length", defaultValue = "10") int length) {
        Pageable pageRequest = new PageRequest(page, length, Sort.Direction.ASC, "id");
        Page<Land> landPage = landService.findAll(pageRequest);

        DataTableObject<Land> dataTableObject = new DataTableObject<>(landPage.getContent(),
                landPage.getContent().size(),
                landPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{landId}/buydetails", method = RequestMethod.GET)
    public DataTableObject<LandBuyDetailBO> getLandBuyDetailsBO(@PathVariable("landId") long id,
                                                                @RequestParam(value = "buyType", required = false) String buyTypeCode,
                                                                @RequestParam(value = "firstname", required = false) String firstname,
                                                                @RequestParam(value = "month", required = false) Integer month,
                                                                @RequestParam(value = "year", required = false) Integer year,
                                                                @RequestParam(value = "page", defaultValue = "0") int page,
                                                                @RequestParam(value = "length", defaultValue = "10") int length) {
        Pageable pageRequest = new PageRequest(page, length, Sort.Direction.ASC, "id");
        BuyType buyType = buyTypeCode == null ? null : BuyType.get(buyTypeCode);

        Page<LandBuyDetailBO> landBuyPage = landBuyService.findLandBuyDetailBOByCriteria(buyType,
                firstname, id, null, month, year, pageRequest);

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

    @RequestMapping(value = "/{landId}/buydetailbos/{buyDetailId}", method = RequestMethod.GET)
    public LandBuyDetailBO getBuyDetailBOById(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId) {
        LandBuyDetailBO bo = landBuyService.findLandByDetailBOById(buyDetailId);
        if (bo == null){
            throw new ResourceNotFoundException();
        }
        return bo;
    }

    @ResponseBody
    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/receipt", method = RequestMethod.GET, produces = "application/pdf")
    public byte[] getReceipt(@PathVariable("landId") long landId,
                             @PathVariable("buyDetailId") long buyDetailId,
                             @RequestParam(value = "receiptId") long receiptId) {
        ByteArrayOutputStream outputStream = landBuyService.getReceipt(buyDetailId, receiptId);
        if (outputStream == null) {
            throw new ResourceNotFoundException();
        }
        return outputStream.toByteArray();
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}", method = RequestMethod.GET)
    public LandBuyDetail getBuyDetailById(@PathVariable("landId") long landId,
                                          @PathVariable("buyDetailId") long buyDetailId) {

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

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/payments", method = RequestMethod.GET)
    public DataTableObject<Payment> getPaymentsByBuyDetailId(@PathVariable("landId") long landId,
                                                          @PathVariable("buyDetailId") long buyDetailId,
                                                          @RequestParam(value = "page", defaultValue = "0") int page,
                                                          @RequestParam(value = "length", defaultValue = "10") int length) {
        Pageable pageable = new PageRequest(page, length);

        Page<Payment> paymentPage = landBuyService.findPaymentsByLandBuyDetailId(buyDetailId, pageable);
        DataTableObject<Payment> dataTableObject = new DataTableObject<>(paymentPage.getContent(),
                paymentPage.getContent().size(),
                paymentPage.getTotalElements());

        return dataTableObject;
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/payments", method = RequestMethod.POST)
    public void savePayment(@PathVariable("landId") long landId,
                                @PathVariable("buyDetailId") long buyDetailId,
                                @RequestBody Payment payment) {

        landBuyService.savePayment(payment);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/payments", method = RequestMethod.PUT)
    public void updatePayment(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                  @RequestBody Payment payment) {
        payment.setPersisted(true);
        landBuyService.savePayment(payment);
    }

    @RequestMapping(value = "/{landId}/buydetails/{buyDetailId}/payments/{paymentId}", method = RequestMethod.DELETE)
    public void deletePayment(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                  @PathVariable("paymentId") long paymentId) {
        landBuyService.deletePaymentById(paymentId);
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
