package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentRecordDAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LandBuyService implements ILandBuyService {

    @Autowired
    private ILandBuyDetailDAO landBuyDetailDAO;
    @Autowired
    private IInstallmentRecordDAO installmentRecordDAO;

    @Override
    public void saveLandBuyDetail(LandBuyDetail landBuyDetail) {
        ModelUtils.setAuditFields(landBuyDetail);
        landBuyDetailDAO.save(landBuyDetail);
    }

    @Override
    public void deleteLandBuyDetailById(long id) {
        landBuyDetailDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public LandBuyDetail findLandBuyDetailById(long id) {
        return landBuyDetailDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<LandBuyDetail> findLandBuyDetailsByCustomerId(long customerId) {
        return landBuyDetailDAO.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<LandBuyDetail> findLandBuyDetailByCriteria(String name, String address, Pageable pageable) {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<LandBuyDetail> findAllLandBuyDetails(Pageable pageable) {
        return landBuyDetailDAO.findAll(pageable);
    }

    @Override
    public void saveInstallmentRecord(InstallmentRecord installmentRecord) {
        ModelUtils.setAuditFields(installmentRecord);
        installmentRecordDAO.save(installmentRecord);
    }

    @Override
    public void deleteInstallmentRecordById(long id) {
        installmentRecordDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public InstallmentRecord findInstallmentRecordById(long id) {
        return installmentRecordDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<InstallmentRecord> findInstallmentRecordsByLandBuyDetailId(long id) {
        return installmentRecordDAO.findByLandBuyDetailId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<InstallmentRecord> findAllInstallmentRecords(Pageable pageable) {
        return installmentRecordDAO.findAll(pageable);
    }
}
