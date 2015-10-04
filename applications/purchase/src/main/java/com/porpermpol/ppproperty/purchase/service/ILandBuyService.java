package com.porpermpol.ppproperty.purchase.service;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.Installment;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ILandBuyService {

    boolean existsLandBuyDetail(long landId, long customerId);
    void saveLandBuyDetail(LandBuyDetail landBuyDetail);
    void deleteLandBuyDetailById(long id);
    LandBuyDetail findLandBuyDetailById(long id);
    List<LandBuyDetail> findLandBuyDetailsByCustomerId(long customerId);

    Page<LandBuyDetailBO> findLandBuyDetailBOByLandId(long id, Pageable pageable);

    Page<LandBuyDetail> findAllLandBuyDetails(Pageable pageable);


    void saveInstallment(Installment installment);
    void deleteInstallmentById(long id);
    Installment findInstallmentById(long id);
    List<Installment> findInstallmentsByLandBuyDetailId(long id);
    Page<Installment> findAllInstallments(Pageable pageable);

}
