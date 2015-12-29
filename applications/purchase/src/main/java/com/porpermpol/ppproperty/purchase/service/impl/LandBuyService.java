package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
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
    private IPaymentDAO paymentDAO;

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
    public ByteArrayOutputStream getReceipt(long buyDetailId, long receiptId) {
        LandBuyDetail buy = landBuyDetailDAO.findOne(buyDetailId);
        Payment payment = paymentDAO.findOne(receiptId);
        if (buy != null && payment != null && buy.getId() == payment.getBuyDetailId()) {
            return landBuyDetailBODAO.getReceipt(buyDetailId, buy.getCustomerId(), payment.getAmount(), receiptId);
        }
        return null;
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
    public void savePayment(Payment payment) {
        ModelUtils.setAuditFields(payment);
        paymentDAO.save(payment);
    }

    @Override
    public void deletePaymentById(long id) {
        paymentDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Payment findPaymentById(long id) {
        return paymentDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Payment> findPaymentsByLandBuyDetailId(long id, Pageable pageable) {
        return paymentDAO.findByLandBuyDetailId(id, pageable);
    }

}
