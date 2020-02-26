package dev.frederik.dramatispersonae.auth

import dev.frederik.dramatispersonae.AuthenticationConfig
import dev.frederik.dramatispersonae.model.UserRepository
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebMvcConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**").allowedMethods("GET", "POST", "DELETE")
    }
}

@EnableWebSecurity
@Profile("!dev")
class WebSecurity(private val userRepository: UserRepository,
                  private val authenticationConfig: AuthenticationConfig) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http.cors().and().authorizeRequests()
            .antMatchers(HttpMethod.OPTIONS).permitAll()
            .antMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and().addFilter(JwtAuthorizationFilter(authenticationManager(), authenticationConfig, userRepository))
    }

}

/**
 * In case of dev mode, no authentication is required for calls and a fake authorization filter is added to act like a
 * dummy user is authenticated.
 */
@EnableWebSecurity
@Profile("dev")
class DummyWebSecurity(private val userRepository: UserRepository,
                       private val authenticationConfig: AuthenticationConfig) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity) {
        http.cors().and().csrf().disable().authorizeRequests().anyRequest().permitAll()
                .and().addFilter(DummyJwtAuthorizationFilter(authenticationManager(), userRepository))
    }

}