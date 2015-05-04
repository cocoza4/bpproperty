package com.porpermpol.ppproperty.core.utils;

import com.porpermpol.ppproperty.core.jdbcrepository.extension.PersistableModel;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.Map;

public abstract class ModelUtils {

    public static Long getNullableLongField(ResultSet rs, String fieldName) throws SQLException {
        return (Long) rs.getObject(fieldName);
    }

    public static Date getNullableDateField(ResultSet rs, String fieldName) throws SQLException {
        Long object = (Long) rs.getObject(fieldName);
        if (object == null) {
            return null;
        } else {
            return new Date(object);
        }
    }

    public static void setNullableDateField(Map map, String columnName, Date obj) {
        if(obj != null) {
            map.put(columnName, obj.getTime());
        } else {
            map.put(columnName, null);
        }
    }

    public static void setAuditFields(Map<String, Object> mapping, PersistableModel model) {
        if (model.isNew()) {
            mapping.put("CREATED_BY", model.getCreatedBy());
            mapping.put("CREATED_TIME", model.getCreatedTime().getTime());
        } else {
            mapping.put("UPDATED_BY", model.getUpdatedBy());
            ModelUtils.setNullableDateField(mapping, "UPDATED_TIME", model.getUpdatedTime());
        }
    }

}
