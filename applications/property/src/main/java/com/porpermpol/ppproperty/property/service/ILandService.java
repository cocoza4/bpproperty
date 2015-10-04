package com.porpermpol.ppproperty.property.service;

import com.porpermpol.ppproperty.property.model.Land;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ILandService {

    void saveLand(Land land);
    void deleteById(long id);
    Land findById(long id);
    Page<Land> findAll(Pageable pageable);
    long count();

}
