package dev.frederik.dramatispersonae

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class AuthenticationConfig {
    @Value("\${spring.googleAuth.clientId}")
    val clientId: String = ""

    @Value("\${spring.googleAuth.clientSecret}")
    val clientSecret: String = ""
}
