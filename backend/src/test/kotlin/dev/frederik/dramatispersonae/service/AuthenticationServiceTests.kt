package dev.frederik.dramatispersonae.service;

import dev.frederik.dramatispersonae.auth.GoogleOpenIdClient;
import dev.frederik.dramatispersonae.auth.TokenSet
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.verify
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test

class AuthenticationControllerTests {

    private val tokenSet = TokenSet("1", "2", "3", 4)
    private val refreshedTokenSet = tokenSet.copy(accessToken = "refreshed")

    @MockK
    lateinit var googleOpenIdClient: GoogleOpenIdClient

    lateinit var authenticationController: AuthenticationController

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        every { googleOpenIdClient.exchangeCodeForTokenSet(any(), any()) } returns tokenSet
        every { googleOpenIdClient.refreshTokenSet(any()) } returns refreshedTokenSet
        authenticationController = AuthenticationController(googleOpenIdClient)
    }

    @Test
    fun `requesting a token set should call code exchange on the Google Open ID Client`() {
        this.authenticationController.getTokenSet(AuthenticationCodeDto("a", "b"))
        verify { googleOpenIdClient.exchangeCodeForTokenSet("a", "b") }
    }

    @Test
    fun `requesting a token set should return the result of the code exchange`() {
        val result = this.authenticationController.getTokenSet(AuthenticationCodeDto("a", "b"))
        Assertions.assertEquals(result.accessToken, tokenSet.accessToken)
        Assertions.assertEquals(result.idToken, tokenSet.idToken)
        Assertions.assertEquals(result.expiresIn, tokenSet.expiresIn)
        Assertions.assertEquals(result.refreshToken, tokenSet.refreshToken)
    }

    @Test
    fun `refreshing a token should call code exchange on the Google Open ID Client`() {
        this.authenticationController.refreshTokenSet(RefreshTokenDto("test"))
        verify { googleOpenIdClient.refreshTokenSet("test") }
    }

    @Test
    fun `refreshing a token should return the result of the code exchange`() {
        val result = this.authenticationController.refreshTokenSet(RefreshTokenDto("test"))
        Assertions.assertEquals(result.accessToken, refreshedTokenSet.accessToken)
        Assertions.assertEquals(result.idToken, refreshedTokenSet.idToken)
        Assertions.assertEquals(result.expiresIn, refreshedTokenSet.expiresIn)
        Assertions.assertEquals(result.refreshToken, refreshedTokenSet.refreshToken)
    }

}
