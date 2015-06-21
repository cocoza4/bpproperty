package com.porpermpol.ppproperty.webapp.security;

import org.springframework.security.core.Authentication;

public class BPPropertySecurityUtils {

    private BPPropertySecurityUtils() {}
    public static Long getUserLoginId(Authentication authentication) {
        return ((BPPropertyAuthentication)authentication).getUserLogin().getId();
    }

}
