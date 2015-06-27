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

    public static <T extends PersistableModel> T setAuditFields(T model) {
        if(model.isNew()) {
            model.setCreatedBy(RequestAttributesUtils.getUserLoginId());
            model.setCreatedTime(RequestAttributesUtils.getCurrentTimestamp());
        } else {
            model.setUpdatedBy(RequestAttributesUtils.getUserLoginId());
            model.setUpdatedTime(RequestAttributesUtils.getCurrentTimestamp());
        }
        return model;
    }

    public static void setAuditFields(Map<String, Object> mapping, PersistableModel model) {
        if (model.isNew()) {
            mapping.put("created_by", model.getCreatedBy());
            mapping.put("created_time", model.getCreatedTime().getTime());
        } else {
            mapping.put("updated_by", model.getUpdatedBy());
            ModelUtils.setNullableDateField(mapping, "updated_time", model.getUpdatedTime());
        }
    }

}
