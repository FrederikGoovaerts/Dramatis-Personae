package dev.frederik.dramatispersonae.auth

import com.google.gson.Gson
import dev.frederik.dramatispersonae.AuthenticationConfig
import java.net.URI
import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets

const val DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

class GoogleOpenIdClient(private val authenticationConfig: AuthenticationConfig) {

    private val httpClient: HttpClient = HttpClient.newBuilder().build()
    private val gson: Gson = Gson()
    private val discoveryDocument: DiscoveryDocument

    init {
        val request = HttpRequest.newBuilder().uri(URI.create(DISCOVERY_URL)).build()
        val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())
        discoveryDocument = gson.fromJson(response.body(), DiscoveryDocument::class.java)
    }

    fun exchangeCodeForTokenSet(code: String, redirectUri: String): TokenSet {
        val formData = mapOf(
                "code" to code,
                "redirect_uri" to redirectUri,
                "client_id" to authenticationConfig.clientId,
                "client_secret" to authenticationConfig.clientSecret,
                "grant_type" to "authorization_code"
        )
        val response = gson.fromJson(postToTokenUrl(formData), CodeResponse::class.java)
        return TokenSet(response.access_token, response.id_token, response.refresh_token, response.expires_in)
    }

    fun refreshTokenSet(refreshToken: String): TokenSet {
        val formData = mapOf(
                "refresh_token" to refreshToken,
                "client_id" to authenticationConfig.clientId,
                "client_secret" to authenticationConfig.clientSecret,
                "grant_type" to "refresh_token"
        )
        val response = gson.fromJson(postToTokenUrl(formData), RefreshResponse::class.java)
        return TokenSet(response.access_token, response.id_token, refreshToken, response.expires_in)
    }

    private fun postToTokenUrl(formData: Map<String, String>): String {
        val reqBody = mapToFormEncodedBody(formData)
        val req = HttpRequest.newBuilder().uri(URI.create(discoveryDocument.token_endpoint))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(reqBody)).build()
        return httpClient.send(req, HttpResponse.BodyHandlers.ofString()).body()

    }

    private fun mapToFormEncodedBody(pairs: Map<String, String>): String {
        return pairs.map {
            entry -> "${URLEncoder.encode(entry.key, StandardCharsets.UTF_8)}=${URLEncoder.encode(entry.value, StandardCharsets.UTF_8)}"
        }.joinToString("&")
    }
}

class DiscoveryDocument(val issuer: String,
                        val authorization_endpoint: String,
                        val token_endpoint: String)

class CodeResponse(val access_token: String,
                   val id_token: String,
                   val expires_in: Int,
                   val token_type: String,
                   val refresh_token: String)

class RefreshResponse(val access_token: String,
                      val id_token: String,
                      val expires_in: Int,
                      val token_type: String)