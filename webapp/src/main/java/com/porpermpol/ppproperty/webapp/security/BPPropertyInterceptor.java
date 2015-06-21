package com.porpermpol.ppproperty.webapp.security;

import com.porpermpol.ppproperty.webapp.utils.RequestAttributesUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;

public class BPPropertyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o) throws Exception {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        requestAttributes.setAttribute(RequestAttributesUtils.CURRENT_TIMESTAMP, new Date(), RequestAttributes.SCOPE_REQUEST);

        Long userLoginId = null;
        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (securityContext != null && securityContext.getAuthentication() != null) {
            userLoginId = BPPropertySecurityUtils.getUserLoginId(securityContext.getAuthentication());
        }
        requestAttributes.setAttribute(RequestAttributesUtils.USER_LOGIN_ID, userLoginId, RequestAttributes.SCOPE_REQUEST);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        // Do nothing
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
        // Do nothing
    }

}
