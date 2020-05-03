package ch.rasc.webauthn;

import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Optional;
import java.util.TimeZone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.yubico.webauthn.RelyingParty;
import com.yubico.webauthn.data.RelyingPartyIdentity;

import ch.rasc.webauthn.security.JooqCredentialRepository;

@SpringBootApplication
public class Application {

  public static final Logger log = LoggerFactory.getLogger("app");

  public static void main(String[] args) {
    TimeZone.setDefault(TimeZone.getTimeZone(ZoneOffset.UTC));
    SpringApplication.run(Application.class, args);
  }

  @Bean
  public RelyingParty relyingParty(JooqCredentialRepository credentialRepository,
      AppProperties appProperties) {

    RelyingPartyIdentity rpIdentity = RelyingPartyIdentity.builder()
        .id(appProperties.getRelyingPartyId()).name(appProperties.getRelyingPartyName())
        .icon(Optional.ofNullable(appProperties.getRelyingPartyIcon())).build();

    return RelyingParty.builder().identity(rpIdentity)
        .credentialRepository(credentialRepository)
        .origins(appProperties.getRelyingPartyOrigins()).build();
  }
  
  
  @Bean
	@SuppressWarnings("unchecked")
	public FilterRegistrationBean simpleCorsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.setAllowedOrigins(Collections.singletonList("http://localhost:8100"));
		config.setAllowedMethods(Collections.singletonList("*"));
		config.setAllowedHeaders(Collections.singletonList("*"));
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}
  
  
}
