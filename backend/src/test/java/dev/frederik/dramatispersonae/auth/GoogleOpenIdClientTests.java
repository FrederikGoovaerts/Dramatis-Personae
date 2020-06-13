package dev.frederik.dramatispersonae.auth;

import com.google.gson.Gson;
import dev.frederik.dramatispersonae.AuthenticationConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static dev.frederik.dramatispersonae.auth.GoogleOpenIdClientKt.DISCOVERY_URL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

@ActiveProfiles("test")
public class GoogleOpenIdClientTests {

    private static final String token_endpoint = "http://token.endpoint";
    private static final String discoveryJson = "{\"token_endpoint\":\"" + token_endpoint + "\"}";

    private static final String access_token = "acc";
    private static final String id_token = "id";
    private static final int expires_in = 10;
    private static final String token_type = "type";
    private static final String refresh_token = "ref";
    private static final String tokenJson = "{" +
            "\"access_token\":\"" + access_token + "\"," +
            "\"id_token\":\"" + id_token + "\"," +
            "\"expires_in\":\"" + expires_in + "\"," +
            "\"token_type\":\"" + token_type + "\"," +
            "\"refresh_token\":\"" + refresh_token + "\"}";

    @Captor
    ArgumentCaptor<HttpRequest> httpRequestCaptor;
    @Mock
    AuthenticationConfig mockAuthenticationConfig;
    @Mock
    HttpResponse<String> mockHttpResponse;
    @Mock
    private HttpClient mockHttpClient;

    private GoogleOpenIdClient googleOpenIdClient;

    @BeforeEach
    public void beforeEach() throws IOException, InterruptedException {
        initMocks(this);
        when(mockAuthenticationConfig.getClientId()).thenReturn("clientId");
        when(mockAuthenticationConfig.getClientSecret()).thenReturn("clientSecret");
        when(mockHttpClient.send(httpRequestCaptor.capture(), any(HttpResponse.BodyHandler.class))).thenReturn(mockHttpResponse);
        when(mockHttpResponse.body()).thenReturn(discoveryJson);
        googleOpenIdClient = new GoogleOpenIdClient(mockAuthenticationConfig, mockHttpClient, new Gson());
    }

    @Test
    public void shouldRequestDiscoveryDocumentOnConstruction() {
        assertThat(httpRequestCaptor.getAllValues().size()).isEqualTo(1);
        assertThat(httpRequestCaptor.getAllValues().get(0).uri().toString()).isEqualTo(DISCOVERY_URL);
    }

    @Test
    public void shouldCorrectlyPostForCodeExchange() {
        when(mockHttpResponse.body()).thenReturn(tokenJson);
        String code = "testCode";
        String redirectUri = "testUri";
        googleOpenIdClient.exchangeCodeForTokenSet(code, redirectUri);
        assertThat(httpRequestCaptor.getAllValues().size()).isEqualTo(2);
        assertThat(httpRequestCaptor.getAllValues().get(1).uri().toString()).isEqualTo(token_endpoint);
    }

    @Test
    public void shouldCorrectlyReturnTokensForCodeExchange() {
        when(mockHttpResponse.body()).thenReturn(tokenJson);
        String code = "testCode";
        String redirectUri = "testUri";
        TokenSet tokens = googleOpenIdClient.exchangeCodeForTokenSet(code, redirectUri);
        assertThat(tokens.getAccessToken()).isEqualTo(access_token);
        assertThat(tokens.getIdToken()).isEqualTo(id_token);
        assertThat(tokens.getExpiresIn()).isEqualTo(expires_in);
        assertThat(tokens.getRefreshToken()).isEqualTo(refresh_token);
    }

    @Test
    public void shouldCorrectlyPostForRefresh() {
        when(mockHttpResponse.body()).thenReturn(tokenJson);
        String refreshToken = "testRefresh";
        googleOpenIdClient.refreshTokenSet(refreshToken);
        assertThat(httpRequestCaptor.getAllValues().size()).isEqualTo(2);
        assertThat(httpRequestCaptor.getAllValues().get(1).uri().toString()).isEqualTo(token_endpoint);
    }

    @Test
    public void shouldCorrectlyReturnTokensForRefresh() {
        when(mockHttpResponse.body()).thenReturn(tokenJson);
        String refreshToken = "testRefresh";
        TokenSet tokens = googleOpenIdClient.refreshTokenSet(refreshToken);
        assertThat(tokens.getAccessToken()).isEqualTo(access_token);
        assertThat(tokens.getIdToken()).isEqualTo(id_token);
        assertThat(tokens.getExpiresIn()).isEqualTo(expires_in);
        assertThat(tokens.getRefreshToken()).isEqualTo(refreshToken);
    }
}
