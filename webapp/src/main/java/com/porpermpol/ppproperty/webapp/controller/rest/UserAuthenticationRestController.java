package com.porpermpol.ppproperty.webapp.controller.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class UserAuthenticationRestController {

    private class AuthenticatedUser {

        private String username;

        public AuthenticatedUser(String username) {
            this.username = username;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }

    @RequestMapping("/postlogin")
    public AuthenticatedUser login(Principal user) {
//        UserLogin userLogin = ((BPPropertyAuthentication)user).getUserLogin();
        return new AuthenticatedUser(user.getName()); // don't return Principal object.
                        // it exposes too much credentials details to the front end
    }

}
