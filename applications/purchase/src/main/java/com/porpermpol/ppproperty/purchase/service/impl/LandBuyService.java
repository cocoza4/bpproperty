package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.IInstallmentDAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.Installment;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class LandBuyService implements ILandBuyService {

    @Autowired
    private ILandBuyDetailBODAO landBuyDetailBODAO;
    @Autowired
    private ILandBuyDetailDAO landBuyDetailDAO;
    @Autowired
    private IInstallmentDAO installmentDAO;

    private Calendar calendar = Calendar.getInstance();

    @Transactional(readOnly = true)
    @Override
    public boolean existsLandBuyDetailByCustomerId(long id) {
        return landBuyDetailDAO.existsByCustomerId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existsLandBuyDetailByLandId(long id) {
        return landBuyDetailDAO.existsByLandId(id);
    }

    @Transactional(readOnly = true)
    @Override
    public boolean existsLandBuyDetail(long landId, long customerId) {
        return landBuyDetailDAO.exists(landId, customerId);
    }

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
    public LandBuyDetailBO findLandByDetailBOById(long id) {
        return landBuyDetailBODAO.findById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public List<LandBuyDetail> findLandBuyDetailsByCustomerId(long customerId) {
        return landBuyDetailDAO.findByCustomerId(customerId);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<LandBuyDetailBO> findLandBuyDetailBOByCriteria(BuyType buyType, String firstName, Long landId, Long customerId,
                                                               Integer month, Integer year, Pageable pageable) {

        Date filteredMonth = null;
        Date filteredYear = null;
        if (month != null && year != null) {
            calendar.set(Calendar.MONTH, month);
            calendar.set(Calendar.YEAR, year);
            filteredMonth = calendar.getTime();
        } else if (year != null) {
            calendar.set(Calendar.YEAR, year);
            filteredYear = calendar.getTime();
        }
        return landBuyDetailBODAO.findByCriteria(buyType, firstName, landId, customerId, filteredMonth, filteredYear, pageable);
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

}
