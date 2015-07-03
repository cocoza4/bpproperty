package com.porpermpol.ppproperty.purchase.service;

import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ILandBuyService {

    void saveLandBuyDetail(LandBuyDetail landBuyDetail);

    void deleteLandBuyDetailById(long id);
    LandBuyDetail findLandBuyDetailById(long id);
    List<LandBuyDetail> findLandBuyDetailsByCustomerId(long customerId);

    Page<LandBuyDetail> findLandBuyDetailByCriteria(String name, String address, Pageable pageable);
    Page<LandBuyDetail> findAllLandBuyDetails(Pageable pageable);


    void saveInstallmentRecord(InstallmentRecord installmentRecord);
    void deleteInstallmentRecordById(long id);
    InstallmentRecord findInstallmentRecordById(long id);
    List<InstallmentRecord> findInstallmentRecordsByLandBuyDetailId(long id);
    Page<InstallmentRecord> findAllInstallmentRecords(Pageable pageable);

}
