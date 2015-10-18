package com.porpermpol.ppproperty.webapp.security;

import com.porpermpol.ppproperty.security.dao.IUserLoginDAO;
import com.porpermpol.ppproperty.security.model.UserLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class BPPropertyUserDetailsService implements UserDetailsService {

    @Autowired
    private IUserLoginDAO userLoginDAO;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserLogin userLogin = userLoginDAO.findByUsername(username);

        if (userLogin == null) {
            throw new UsernameNotFoundException("can't found username:" + username);
        }

        List<GrantedAuthority> authorities = Collections.<GrantedAuthority>singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        return new User(username,
                userLogin.getPassword(),
                authorities);
    }

}
