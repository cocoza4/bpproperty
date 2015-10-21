package com.porpermpol.ppproperty.property.dao.impl;

import com.nurkiewicz.jdbcrepository.JdbcRepository;
import com.nurkiewicz.jdbcrepository.RowUnmapper;
import com.nurkiewicz.jdbcrepository.sql.PostgreSqlGenerator;
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
        super(ROW_MAPPER, ROW_UNMAPPER, "land", "id");
        setSqlGenerator(new PostgreSqlGenerator());
    }

    public static final RowMapper<Land> ROW_MAPPER = new RowMapper<Land>() {
        @Override
        public Land mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Land(rs.getLong("id"),
                    rs.getString("name"),
                    new Area(rs.getInt("rai"), rs.getInt("yarn"), rs.getInt("tarangwa")),
                    rs.getString("address"),
                    rs.getString("description"),
                    rs.getLong("created_by"),
                    new Date(rs.getLong("created_time")),
                    ModelUtils.getNullableLongField(rs, "updated_by"),
                    ModelUtils.getNullableDateField(rs, "updated_time")).withPersisted(true);
        }
    };

    private static final RowUnmapper<Land> ROW_UNMAPPER = new RowUnmapper<Land>() {
        @Override
        public Map<String, Object> mapColumns(Land model) {
            Map<String, Object> mapping = new LinkedHashMap<>();
            mapping.put("id", model.getId());
            mapping.put("name", model.getName());
            mapping.put("rai", model.getArea().getRai());
            mapping.put("yarn", model.getArea().getYarn());
            mapping.put("tarangwa", model.getArea().getTarangwa());
            mapping.put("address", model.getAddress());
            mapping.put("description", model.getDescription());
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
