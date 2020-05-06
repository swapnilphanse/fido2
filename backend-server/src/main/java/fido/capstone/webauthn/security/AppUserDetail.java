package fido.capstone.webauthn.security;

import java.util.Set;

import org.springframework.security.core.GrantedAuthority;

import fido.capstone.webauthn.db.tables.records.AppUserRecord;

public class AppUserDetail {

  private final Long appUserId;

  private final String username;
  private final String name;
  private final String email;

  private final Set<GrantedAuthority> authorities;

  public AppUserDetail(AppUserRecord user, GrantedAuthority authority) {
    this.appUserId = user.getId();
    this.username = user.getUsername();
    this.name = user.getName();
    this.email = user.getEmail();
    this.authorities = Set.of(authority);
  }

  public Long getAppUserId() {
    return this.appUserId;
  }

  public String getUsername() {
    return this.username;
  }
  
  public String getName() {
	    return this.name;
	  }
  
  public String getEmail() {
	    return this.email;
	  }

  public Set<GrantedAuthority> getAuthorities() {
    return this.authorities;
  }

}
