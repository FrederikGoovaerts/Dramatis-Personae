package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.auth.GoogleOpenIdClient
import dev.frederik.dramatispersonae.auth.TokenSet
import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

class CreateCampaignDto(var name: String)

@RestController
@RequestMapping("/api/campaign")
class CampaignController(private val repository: CampaignRepository) {

    @GetMapping("/")
    fun getCampaigns() = repository.findAll()

    @PostMapping("/")
    fun postCampaign(auth: GoogleAuthentication, @RequestBody campaign: CreateCampaignDto) {
        val newCampaign = Campaign(campaign.name)
        this.repository.save(newCampaign)
    }

}

data class AuthenticationCodeDto(val code: String, val redirectUri: String)
data class RefreshTokenDto(val token: String)

@RestController
@RequestMapping("/api/auth")
class AuthenticationController @Autowired constructor(authenticationConfig: AuthenticationConfig) {
    private val googleOpenIdClient: GoogleOpenIdClient = GoogleOpenIdClient(authenticationConfig)

    @PostMapping("/code")
    fun getTokenSet(@Validated @RequestBody dto: AuthenticationCodeDto): TokenSet {
        return googleOpenIdClient.exchangeCodeForTokenSet(dto.code, dto.redirectUri)
    }

    @PostMapping("/refresh")
    fun refreshTokenSet(@Validated @RequestBody dto: RefreshTokenDto): TokenSet {
        return googleOpenIdClient.refreshTokenSet(dto.token)
    }
}