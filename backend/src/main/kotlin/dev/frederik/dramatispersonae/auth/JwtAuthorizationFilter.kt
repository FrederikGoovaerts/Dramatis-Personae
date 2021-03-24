package dev.frederik.dramatispersonae.auth

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import dev.frederik.dramatispersonae.AuthenticationConfig
import dev.frederik.dramatispersonae.model.User
import dev.frederik.dramatispersonae.model.UserRepository
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import java.security.GeneralSecurityException
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

const val AUTHORIZATION_HEADER_KEY = "Authorization"
const val TOKEN_PREFIX = "Bearer "

class GoogleAuthentication(
    private val jwt: String,
    private val user: User
) : AbstractAuthenticationToken(null) {
    override fun getCredentials(): String = jwt
    override fun getPrincipal(): User = user
}

class JwtAuthorizationFilter(
    authenticationManager: AuthenticationManager,
    authenticationConfig: AuthenticationConfig,
    private val userRepository: UserRepository
) : BasicAuthenticationFilter(authenticationManager) {
    private val jwtVerifier: GoogleIdTokenVerifier = GoogleIdTokenVerifier
        .Builder(NetHttpTransport(), JacksonFactory())
        .setAudience(listOf(authenticationConfig.clientId))
        .build()

    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain) {
        val authorizationHeader: String? = req.getHeader(AUTHORIZATION_HEADER_KEY)
        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            try {
                val token = authorizationHeader.replace(TOKEN_PREFIX, "")
                val idToken: GoogleIdToken? = jwtVerifier.verify(token)
                if (idToken != null) {
                    val userId: String = idToken.payload.subject
                    var user: User? = userRepository.findByGoogleId(userId)
                    if (user == null) {
                        var newUser = User(userId, idToken.payload["name"] as String, idToken.payload.email)
                        newUser = userRepository.save(newUser)
                        user = newUser
                    }
                    val authentication = GoogleAuthentication(token, user)
                    authentication.isAuthenticated = true
                    SecurityContextHolder.getContext().authentication = authentication
                }
            } catch (e: GeneralSecurityException) {
                println("JWT supplied which could not be verified.")
            }
        }
        chain.doFilter(req, res)
    }
}

/**
 * Dummy authorization filter for dev mode that regardless of request contents acts as if a dummy user is authenticated.
 */
class DummyJwtAuthorizationFilter(
    authenticationManager: AuthenticationManager,
    private val userRepository: UserRepository
) : BasicAuthenticationFilter(authenticationManager) {

    private val DUMMY_GOOGLE_ID = "1"
    private val DUMMY_NAME = "Name"
    private val DUMMY_EMAIL = "name@example.com"

    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain) {
        var user: User? = userRepository.findByGoogleId(DUMMY_GOOGLE_ID)
        if (user == null) {
            val newUser = userRepository.save(User(DUMMY_GOOGLE_ID, DUMMY_NAME, DUMMY_EMAIL))
            user = newUser
        }
        val authentication = GoogleAuthentication("", user)
        authentication.isAuthenticated = true
        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(req, res)
    }
}
