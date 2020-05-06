package fido.capstone.webauthn;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import fido.capstone.webauthn.security.AppUserDetail;

@RestController
public class TestService {

  @GetMapping("/secret")
  public String secretMessage(@AuthenticationPrincipal AppUserDetail user) {
    System.out.println("user id:  " + user.getAppUserId());
    System.out.println("username: " + user.getUsername());
    System.out.println("name: " + user.getName());
    return user.getName();
  }

}
