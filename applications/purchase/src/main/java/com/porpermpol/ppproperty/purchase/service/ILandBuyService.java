package com.porpermpol.ppproperty.purchase.service;

import com.porpermpol.ppproperty.purchase.bo.LandBuyDetailBO;
import com.porpermpol.ppproperty.purchase.model.BuyType;
import com.porpermpol.ppproperty.purchase.model.LandBuyDetail;
import com.porpermpol.ppproperty.purchase.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayOutputStream;
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

    ByteArrayOutputStream getReceipt(long buyDetailId, long receiptId);

    Page<LandBuyDetailBO> findLandBuyDetailBOByCriteria(BuyType buyType, String firstName, Long landId, Long customerId,
                                                        Integer month, Integer year, Pageable pageable);

    void savePayment(Payment payment);
    void deletePaymentById(long id);
    Payment findPaymentById(long id);
    Page<Payment> findPaymentsByLandBuyDetailId(long id, Pageable pageable);
}
