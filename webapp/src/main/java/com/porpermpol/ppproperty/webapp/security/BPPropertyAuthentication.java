package com.porpermpol.ppproperty.webapp.security;

import com.porpermpol.ppproperty.security.model.UserLogin;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class BPPropertyAuthentication extends UsernamePasswordAuthenticationToken implements Authentication {

    private UserLogin userLogin;

    public BPPropertyAuthentication(Object principal,
                                  Object credentials,
                                  Collection<? extends GrantedAuthority> authorities,
                                  UserLogin userLogin) {
        super(principal, credentials, authorities);
        this.userLogin = userLogin;
    }

    public UserLogin getUserLogin() {
        return userLogin;
    }

}
