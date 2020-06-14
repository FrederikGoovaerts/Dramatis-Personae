package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleOpenIdClient
import dev.frederik.dramatispersonae.auth.TokenSet
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class AuthenticationCodeDto(val code: String, val redirectUri: String)
data class RefreshTokenDto(val token: String)

@RestController
@RequestMapping("/api/auth")
class AuthenticationController @Autowired constructor(private val googleOpenIdClient: GoogleOpenIdClient) {

    @PostMapping("/code")
    fun getTokenSet(@Validated @RequestBody dto: AuthenticationCodeDto): TokenSet {
        return googleOpenIdClient.exchangeCodeForTokenSet(dto.code, dto.redirectUri)
    }

    @PostMapping("/refresh")
    fun refreshTokenSet(@Validated @RequestBody dto: RefreshTokenDto): TokenSet {
        return googleOpenIdClient.refreshTokenSet(dto.token)
    }
}
