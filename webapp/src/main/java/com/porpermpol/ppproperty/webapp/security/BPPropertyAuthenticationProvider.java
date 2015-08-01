package com.porpermpol.ppproperty.webapp.security;

import com.porpermpol.ppproperty.security.dao.IUserLoginDAO;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public class BPPropertyAuthenticationProvider extends DaoAuthenticationProvider implements ApplicationContextAware {

    ApplicationContext applicationContext = null;

    @Override
    public Authentication createSuccessAuthentication(Object principal, Authentication authentication, UserDetails user) {
        System.out.println("Provider: " + user.getUsername() + ", " + user.getPassword());
        UsernamePasswordAuthenticationToken result
                = new BPPropertyAuthentication(authentication.getPrincipal(),
                authentication.getCredentials(),
                user.getAuthorities(),
                getUserLoginDAO().findByUsername(user.getUsername()));
        result.setDetails(authentication.getDetails());
        return result;
    }

    @Override
    public void setApplicationContext(final ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    private IUserLoginDAO getUserLoginDAO() {
        if (applicationContext != null){
            return  applicationContext.getBean(IUserLoginDAO.class);
        }
        return null;
    }
}
