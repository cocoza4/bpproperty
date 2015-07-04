package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentDAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.Installment;
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
    private ILandBuyDetailBODAO landBuyDetailBODAO;
    @Autowired
    private ILandBuyDetailDAO landBuyDetailDAO;
    @Autowired
    private IInstallmentDAO installmentDAO;

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
    public Page<LandBuyDetailBO> findLandBuyDetailBOByLandId(long id, Pageable pageable) {
        return landBuyDetailBODAO.findByLandId(id, pageable);
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
    public void saveInstallment(Installment installment) {
        ModelUtils.setAuditFields(installment);
        installmentDAO.save(installment);
    }

    @Override
    public void deleteInstallmentById(long id) {
        installmentDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Installment findInstallmentById(long id) {
        return installmentDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<Installment> findInstallmentsByLandBuyDetailId(long id) {
        return installmentDAO.findByLandBuyDetailId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Installment> findAllInstallments(Pageable pageable) {
        return installmentDAO.findAll(pageable);
    }
}
