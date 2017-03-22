package com.porpermpol.ppproperty.purchase.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.person.dao.ICustomerDAO;
import com.porpermpol.ppproperty.person.model.Customer;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.bo.ReceiptBO;
import com.porpermpol.ppproperty.purchase.bo.ReceiptItemBO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailBODAO;
import com.porpermpol.ppproperty.purchase.dao.ILandBuyDetailDAO;
import com.porpermpol.ppproperty.purchase.dao.IPaymentDAO;
import com.porpermpol.ppproperty.purchase.dao.IReceiptBODAO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import com.porpermpol.ppproperty.purchase.service.ILandBuyService;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.*;

@Service
public class LandBuyService implements ILandBuyService {

    private static final Locale TH_LOCALE = new Locale("th", "TH");
    private static final String JASPER_FILE = LandBuyService.class.getClassLoader().getResource("jasper/receipt.jasper").getFile();

    @Autowired
    private ILandBuyDetailBODAO landBuyDetailBODAO;
    @Autowired
    private ILandBuyDetailDAO landBuyDetailDAO;
    @Autowired
    private IPaymentDAO paymentDAO;
    @Autowired
    private ILandDAO landDAO;
    @Autowired
    private ICustomerDAO customerDAO;
    @Autowired
    private IReceiptBODAO receiptBODAO;

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

    private ReceiptItemBO buildReceiptItemBO(boolean isDownPayment, ReceiptBO bo) {
        float total = bo.getAccPayment();
        float debt = bo.getDebt();
        if (!isDownPayment) {
            total += bo.getDownPayment();
        } else {
            debt += bo.getDownPayment();
        }
        ReceiptItemBO receiptItemBO = new ReceiptItemBO(bo.getLandName(), bo.getBuyType().getCode(),
                bo.getBuyPrice(), total, debt);

        return receiptItemBO;
    }

    @Transactional(readOnly = true)
    @Override
    public ByteArrayOutputStream getReceipt(long buyDetailId, long receiptId) {

        ReceiptBO bo = receiptBODAO.findReceiptById(buyDetailId, receiptId);
        Payment payment = paymentDAO.findOne(receiptId);

        if (bo != null && payment != null && bo.getLandBuyDetailId() == payment.getBuyDetailId()) {

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ReceiptItemBO receiptItemBO = this.buildReceiptItemBO(payment.isDownPayment(), bo);

            List<ReceiptItemBO> list = Arrays.asList(receiptItemBO);
            JRBeanCollectionDataSource receiptJRBean = new JRBeanCollectionDataSource(list, false);

            Map params = new HashMap();
            params.put(JRParameter.REPORT_LOCALE, TH_LOCALE);
            params.put("receipt_id", receiptId);
            params.put("customer_name", bo.getBuyerFirstName() + " " + bo.getBuyerLastName());
            params.put("address", bo.getBuyerAddress());
            params.put("tel", bo.getBuyerTel());
            params.put("payment", payment.getAmount());
            params.put("receipt_datasource", receiptJRBean);

            try {
                JasperPrint jasperPrint = JasperFillManager.fillReport(JASPER_FILE, params, new JREmptyDataSource());
                JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
            } catch (JRException e) {
                e.printStackTrace();
            }

            return outputStream;
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
