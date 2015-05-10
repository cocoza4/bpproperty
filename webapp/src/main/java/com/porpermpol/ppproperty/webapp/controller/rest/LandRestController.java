package com.porpermpol.ppproperty.webapp.controller.rest;

import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.webapp.exception.ResourceNotFoundException;
import com.porpermpol.ppproperty.webapp.utils.DataTableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/land")
public class LandRestController {

    @Autowired
    private ILandDAO landDAO;

    @Autowired
    private ILandBuyDetailDAO buyDetailDAO;

    @RequestMapping(value = "/{landId}", method = RequestMethod.GET)
    public Land getLandById(@PathVariable("landId") long id) {

        Land Land = landDAO.findOne(id);
        if (Land == null) {
            throw new ResourceNotFoundException();
        }
        return Land;
    }

    @RequestMapping(method = RequestMethod.GET)
    public DataTableObject<Land> getAllLands(@RequestParam(value = "page", defaultValue = "0") int page,
                                            @RequestParam(value = "length", defaultValue = "10") int length) {
        Pageable pageRequest = new PageRequest(page, length);
        Page<Land> landPage = landDAO.findAll(pageRequest);

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
        Page<LandBuyDetail> landBuyPage = buyDetailDAO.findAll(pageRequest);

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

        LandBuyDetail buyDetail = buyDetailDAO.findOne(buyDetailId);
        if (buyDetail == null) {
            throw new ResourceNotFoundException();
        }

        return buyDetail;
    }

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void saveLand(@RequestBody Land land) {

        System.out.println("SAVE NEW LAND: ");

        System.out.println(land.getName());

        land.setCreatedBy(0L);
        land.setCreatedTime(new Date());

        System.out.println(land.getAddress());
        System.out.println("rai: " + land.getArea().getRai());
        System.out.println("yarn: " + land.getArea().getYarn());
        System.out.println("tarangwa: " + land.getArea().getTarangwa());
        System.out.println(land.getDescription());
        System.out.println(land.getCreatedBy());
        System.out.println(land.getCreatedTime());
        System.out.println(land.toString());

        landDAO.save(land);

        System.out.println(landDAO.findOne(land.getId()).getName());
    }

    @RequestMapping(value = "/{landId}", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void updateLand(@PathVariable("landId") long landId, @RequestBody Land land) {

        System.out.println("UPDATE LAND: ");

        System.out.println(land.getName());
        System.out.println(land.getAddress());
        System.out.println("rai: " + land.getArea().getRai());
        System.out.println("yarn: " + land.getArea().getYarn());
        System.out.println("tarangwa: " + land.getArea().getTarangwa());
        System.out.println(land.getDescription());
        land.setPersisted(true);
        landDAO.save(land);
    }

    @RequestMapping(value = "/{landId}/buyDetail", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public void saveBuyDetail(@PathVariable("landId") long landId, @RequestBody LandBuyDetail buyDetail) {

        System.out.println("SAVE BUY DETAIL: ");
        buyDetail.setPropertyId(landId);
        buyDetail.setCreatedBy(0L);
        buyDetail.setCreatedTime(new Date());

        System.out.println("area: " + buyDetail.getArea());

        System.out.println(buyDetail.getBuyType());
        System.out.println(buyDetail.getBuyPrice());
        System.out.println("rai: " + buyDetail.getArea().getRai());
        System.out.println("yarn: " + buyDetail.getArea().getYarn());
        System.out.println("tarangwa: " + buyDetail.getArea().getTarangwa());
        System.out.println(buyDetail.getDescription());
        buyDetailDAO.save(buyDetail);
    }

    @RequestMapping(value = "/{landId}/buyDetail/{buyDetailId}", method = RequestMethod.PUT)
    public void updateBuyDetail(@PathVariable("landId") long landId,
                                  @PathVariable("buyDetailId") long buyDetailId,
                                 @RequestBody LandBuyDetail buyDetail) {

        System.out.println("UPDATE BUY DETAIL: ");

        System.out.println(buyDetail.getBuyType());
        System.out.println(buyDetail.getBuyPrice());
        System.out.println("rai: " + buyDetail.getArea().getRai());
        System.out.println("yarn: " + buyDetail.getArea().getYarn());
        System.out.println("tarangwa: " + buyDetail.getArea().getTarangwa());
        System.out.println(buyDetail.getDescription());
        buyDetail.setPersisted(true);
        buyDetailDAO.save(buyDetail);
    }



}
