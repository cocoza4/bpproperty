package com.porpermpol.ppproperty.property.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.porpermpol.ppproperty.core.utils.ModelUtils;
import com.porpermpol.ppproperty.property.dao.ILandDAO;
import com.porpermpol.ppproperty.property.model.Area;
import com.porpermpol.ppproperty.property.model.Land;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class LandDAO extends JdbcRepository<Land, Long> implements ILandDAO {

    public LandDAO() {
        super(ROW_MAPPER, ROW_UNMAPPER, "LAND", "ID");
    }

    public static final RowMapper<Land> ROW_MAPPER = new RowMapper<Land>() {
        @Override
        public Land mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Land(rs.getLong("ID"),
                    rs.getString("NAME"),
                    new Area(rs.getInt("RAI"), rs.getInt("YARN"), rs.getInt("TARANGWA")),
                    rs.getString("ADDRESS"),
                    rs.getString("DESCRIPTION"),
                    rs.getLong("CREATED_BY"),
                    new Date(rs.getLong("CREATED_TIME")),
                    ModelUtils.getNullableLongField(rs, "UPDATED_BY"),
                    ModelUtils.getNullableDateField(rs, "UPDATED_TIME")).withPersisted(true);
        }
    };

    private static final RowUnmapper<Land> ROW_UNMAPPER = new RowUnmapper<Land>() {
        @Override
        public Map<String, Object> mapColumns(Land model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("ID", model.getId());
            mapping.put("NAME", model.getName());
            mapping.put("RAI", model.getArea().getRai());
            mapping.put("YARN", model.getArea().getYarn());
            mapping.put("TARANGWA", model.getArea().getTarangwa());
            mapping.put("ADDRESS", model.getAddress());
            mapping.put("DESCRIPTION", model.getDescription());
            ModelUtils.setAuditFields(mapping, model);
            return mapping;
        }
    };

    @Override
    protected Land postCreate(Land entity, Number generatedId) {
        entity.setId(generatedId.longValue());
        return entity.withPersisted(true);
    }

    @Override
    protected Land postUpdate(Land entity) {
        return entity.withPersisted(true);
    }

}
