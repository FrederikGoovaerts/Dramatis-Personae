package dev.frederik.dramatispersonae.auth

import com.google.gson.Gson
import dev.frederik.dramatispersonae.AuthenticationConfig
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

private const val token_endpoint = "http://token.endpoint"
private const val discoveryJson = "{\"token_endpoint\":\"$token_endpoint\"}"
private const val access_token = "acc"
private const val id_token = "id"
private const val expires_in = 10
private const val token_type = "type"
private const val refresh_token = "ref"
private const val tokenJson = "{" +
        "\"access_token\":\"" + access_token + "\"," +
        "\"id_token\":\"" + id_token + "\"," +
        "\"expires_in\":\"" + expires_in + "\"," +
        "\"token_type\":\"" + token_type + "\"," +
        "\"refresh_token\":\"" + refresh_token + "\"}"

class GoogleOpenIdClientTests {

    private val httpRequestCaptor = mutableListOf<HttpRequest>()

    @MockK
    lateinit var mockAuthenticationConfig: AuthenticationConfig

    @MockK
    lateinit var mockHttpResponse: HttpResponse<String>

    @MockK
    lateinit var mockHttpClient: HttpClient

    lateinit var googleOpenIdClient: GoogleOpenIdClient

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        every { mockAuthenticationConfig.clientId } returns "clientId"
        every { mockAuthenticationConfig.clientSecret } returns "clientSecret"
        every { mockHttpClient.send<String>(capture(httpRequestCaptor), any()) } returns mockHttpResponse
        every { mockHttpResponse.body() } returns discoveryJson
        googleOpenIdClient = GoogleOpenIdClient(mockAuthenticationConfig, mockHttpClient, Gson())
    }

    @Test
    fun `construction should request the discovery document`() {
        Assertions.assertEquals(1, httpRequestCaptor.size)
        Assertions.assertEquals(DISCOVERY_URL, httpRequestCaptor[0].uri().toString())
    }

    @Test
    fun `code exchange should post to the token endpoint`() {
        every { mockHttpResponse.body() } returns tokenJson
        val code = "testCode"
        val redirectUri = "testUri"
        googleOpenIdClient.exchangeCodeForTokenSet(code, redirectUri)
        Assertions.assertEquals(2, httpRequestCaptor.size)
        Assertions.assertEquals(token_endpoint, httpRequestCaptor[1].uri().toString())
    }
    
    @Test
    fun `code exchange should correctly return the token set`() {
        every { mockHttpResponse.body() } returns tokenJson
        val code = "testCode"
        val redirectUri = "testUri"
        val (accessToken, idToken, refreshToken, expiresIn) = googleOpenIdClient.exchangeCodeForTokenSet(code, redirectUri)
        Assertions.assertEquals(access_token, accessToken)
        Assertions.assertEquals(id_token, idToken)
        Assertions.assertEquals(expires_in, expiresIn)
        Assertions.assertEquals(refresh_token, refreshToken)
    }

    @Test
    fun `token refresh should post to the token endpoint`() {
        every { mockHttpResponse.body() } returns tokenJson
        val refreshToken = "testRefresh"
        googleOpenIdClient.refreshTokenSet(refreshToken)
        Assertions.assertEquals(2, httpRequestCaptor.size)
        Assertions.assertEquals(token_endpoint, httpRequestCaptor[1].uri().toString())
    }

    @Test
    fun `token refresh should correctly return the token set`() {
        every { mockHttpResponse.body() } returns tokenJson
        val token = "testRefresh"
        val (accessToken, idToken, refreshToken, expiresIn) = googleOpenIdClient.refreshTokenSet(token)
        Assertions.assertEquals(access_token, accessToken)
        Assertions.assertEquals(id_token, idToken)
        Assertions.assertEquals(expires_in, expiresIn)
        Assertions.assertEquals(token, refreshToken)
    }

}