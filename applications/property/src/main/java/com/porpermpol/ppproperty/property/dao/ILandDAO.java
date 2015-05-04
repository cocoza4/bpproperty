package com.porpermpol.ppproperty.property.dao;

import com.porpermpol.ppproperty.property.model.Land;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ILandDAO extends PagingAndSortingRepository<Land, Long> {
}
