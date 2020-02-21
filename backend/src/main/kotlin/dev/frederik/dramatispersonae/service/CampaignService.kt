package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.User
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.*

data class CreateCampaignDto(var name: String)

data class CampaignListView(var name: String, var id: UUID)

@RestController
@RequestMapping("/api/campaign")
class CampaignController(private val service: CampaignService) {

    @GetMapping("/")
    fun getCampaigns(auth: GoogleAuthentication) =
            service.getCampaignsForUser(auth.principal).map { CampaignListView(it.name, it.id!!) }

    @PostMapping("/")
    fun postCampaign(auth: GoogleAuthentication, @RequestBody campaign: CreateCampaignDto): CampaignListView {
        val newCampaign = this.service.createCampaign(auth.principal, campaign.name)
        return CampaignListView(newCampaign.name, newCampaign.id!!)
    }

}

@Component
class CampaignService(private val repository: CampaignRepository) {

    fun getCampaignsForUser(user: User): List<Campaign> = repository.findAll().filter { it.isAccessibleBy(user) }

    fun createCampaign(user: User, name: String): Campaign {
        val newCampaign = Campaign(name, user, mutableListOf(user), mutableListOf())
        return this.repository.save(newCampaign)
    }
}