package com.porpermpol.ppproperty.purchase.dao;

import com.porpermpol.ppproperty.purchase.model.InstallmentRecord;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface IInstallmentRecordDAO extends PagingAndSortingRepository<InstallmentRecord, Long> {

    List<InstallmentRecord> findByBuyDetailId(long buyDetailId);

}
