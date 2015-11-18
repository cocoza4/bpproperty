package com.porpermpol.ppproperty.purchase.service;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.Installment;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ILandBuyService {

    boolean existsLandBuyDetailByCustomerId(long id);
    boolean existsLandBuyDetailByLandId(long id);
    boolean existsLandBuyDetail(long landId, long customerId);
    void saveLandBuyDetail(LandBuyDetail landBuyDetail);
    void deleteLandBuyDetailById(long id);
    LandBuyDetail findLandBuyDetailById(long id);
    LandBuyDetailBO findLandByDetailBOById(long id);
    List<LandBuyDetail> findLandBuyDetailsByCustomerId(long customerId);

    Page<LandBuyDetailBO> findLandBuyDetailBOByCriteria(BuyType buyType, String firstName, Long landId, Long customerId,
                                                        Integer month, Integer year, Pageable pageable);

    void saveInstallment(Installment installment);
    void deleteInstallmentById(long id);
    Installment findInstallmentById(long id);
    Page<Installment> findInstallmentsByLandBuyDetailId(long id, Pageable pageable);
}
