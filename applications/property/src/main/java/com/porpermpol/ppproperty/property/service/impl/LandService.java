package com.porpermpol.ppproperty.property.service.impl;

import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Land;
import com.porpermpol.ppproperty.property.service.ILandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LandService implements ILandService {

    @Autowired
    private ILandDAO landDAO;

    @Override
    public void saveLand(Land land) {
        ModelUtils.setAuditFields(land);
        landDAO.save(land);
    }

    @Override
    public void deleteById(long id) {
        landDAO.delete(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Land findById(long id) {
        return landDAO.findOne(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Land> findByCriteria(String name, String address, Pageable pageable) {
        return null;
    }

    @Transactional(readOnly = true)
    @Override
    public Page<Land> findAll(Pageable pageable) {
        return landDAO.findAll(pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public long count() {
        return landDAO.count();
    }
}
