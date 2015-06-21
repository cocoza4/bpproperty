package com.porpermpol.ppproperty.webapp.utils;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.Date;

public class RequestAttributesUtils {

    public final static String REQUEST_TIMESTAMP = "requestTimestamp";
    public final static String REQUEST_USER = "requestUser";

    public static Date getRequestTime() {
        return (Date) RequestContextHolder.getRequestAttributes().getAttribute(REQUEST_TIMESTAMP, RequestAttributes.SCOPE_REQUEST);
    }

    public static Long getUserLoginId() {
        return (Long) RequestContextHolder.getRequestAttributes().getAttribute(REQUEST_USER, RequestAttributes.SCOPE_REQUEST);
    }

}
