package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.User
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.*

data class CreateCampaignDto(val name: String)

data class CampaignView(val name: String, val id: UUID, val owner: Boolean)

@RestController
@RequestMapping("/api/campaign")
class CampaignController(private val service: CampaignService) {

    @GetMapping("/")
    fun getCampaigns(auth: GoogleAuthentication) =
            service.getCampaignsForUser(auth.principal).map { CampaignView(it.name, it.id!!, it.isOwnedBy(auth.principal)) }

    @PostMapping("/")
    fun postCampaign(auth: GoogleAuthentication, @RequestBody campaign: CreateCampaignDto): ResponseEntity<Unit> {
        this.service.createCampaign(auth.principal, campaign.name)
        return ResponseEntity(HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateCampaign(auth: GoogleAuthentication,
                       @PathVariable id: UUID,
                       @RequestBody campaign: CreateCampaignDto): ResponseEntity<Unit> {
        val success = this.service.updateCampaign(auth.principal, id, campaign.name)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteCampaign(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteCampaign(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

}

@Component
class CampaignService(private val repository: CampaignRepository) {

    fun getCampaignsForUser(user: User): List<Campaign> = repository.findAll().filter { it.isAccessibleBy(user) }

    fun createCampaign(user: User, name: String): Campaign {
        val newCampaign = Campaign(name, user, mutableListOf(user), mutableListOf())
        return this.repository.save(newCampaign)
    }

    fun updateCampaign(user: User, id: UUID, name: String): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.name = name
        this.repository.save(campaign)
        return true
    }

    fun deleteCampaign(user: User, id: UUID): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        repository.delete(campaignQuery.get())
        return true
    }
}
