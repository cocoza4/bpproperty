package com.porpermpol.ppproperty.core.utils;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Date;

public abstract class RequestAttributesUtils {

    public final static String CURRENT_TIMESTAMP = "CURRENT_TIMESTAMP";
    public final static String USER_LOGIN_ID = "USER_LOGIN_ID";

    public static Date getCurrentTimestamp() {
        return (Date) RequestContextHolder.getRequestAttributes().getAttribute(CURRENT_TIMESTAMP, RequestAttributes.SCOPE_REQUEST);
    }

    public static Long getUserLoginId() {
        return (Long) RequestContextHolder.getRequestAttributes().getAttribute(USER_LOGIN_ID, RequestAttributes.SCOPE_REQUEST);
    }

}
