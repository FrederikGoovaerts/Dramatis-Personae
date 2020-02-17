package dev.frederik.dramatispersonae.auth

import dev.frederik.dramatispersonae.AuthenticationConfig
import dev.frederik.dramatispersonae.model.UserRepository
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@EnableWebSecurity
@Profile("!dev-light")
class WebSecurity(private val userRepository: UserRepository,
                  private val authenticationConfig: AuthenticationConfig) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http.cors().and().csrf().disable().authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS).permitAll()
            .antMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and().addFilter(JwtAuthorizationFilter(authenticationManager(), authenticationConfig, userRepository))
    }

}

@EnableWebSecurity
@Profile("dev-light")
class DummyWebSecurity(private val userRepository: UserRepository,
                       private val authenticationConfig: AuthenticationConfig) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http.cors().and().csrf().disable().authorizeRequests().anyRequest().permitAll()
                .and().addFilter(DummyJwtAuthorizationFilter(authenticationManager(), userRepository))
    }

}