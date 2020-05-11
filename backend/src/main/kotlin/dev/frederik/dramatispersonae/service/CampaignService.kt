package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.Character
import dev.frederik.dramatispersonae.model.User
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.*

data class CreateCampaignDto(val name: String)

data class CampaignView(val name: String, val id: UUID, val owner: Boolean, val ownerName: String, val inviteCode: UUID?)
data class CampaignMemberView(val name: String, val owner: Boolean)

@RestController
@RequestMapping("/api/campaign")
class CampaignController(private val service: CampaignService) {

    @GetMapping
    fun getCampaigns(auth: GoogleAuthentication) =
            service.getCampaignsForUser(auth.principal).map {
                CampaignView(
                    it.name,
                    it.id!!,
                    it.isOwnedBy(auth.principal),
                    it.owner.fullName,
                    if (it.isOwnedBy(auth.principal)) it.inviteCode else null
                )
            }

    @GetMapping("/{id}")
    fun getCampaign(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<CampaignView> {
        val campaign = this.service.getCampaign(auth.principal, id)
        return if (campaign === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(CampaignView(
                campaign.name,
                campaign.id!!,
                campaign.isOwnedBy(auth.principal),
                campaign.owner.fullName,
                if (campaign.isOwnedBy(auth.principal)) campaign.inviteCode else null
            ), HttpStatus.OK)
        }
    }

    @PostMapping
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

    @GetMapping("/{id}/character")
    fun getCampaignCharacterList(auth: GoogleAuthentication,
                                 @PathVariable id: UUID): ResponseEntity<List<CharacterListView>> {
        val list = this.service.getCampaignCharacters(auth.principal, id)
        return if (list === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(list.map { CharacterListView(it.name, it.isVisible, it.id!!) }, HttpStatus.OK)
        }
    }

    @PostMapping("/{id}/character")
    fun createCampaignCharacter(auth: GoogleAuthentication,
                                @PathVariable id: UUID,
                                @RequestBody dto: CreateCharacterDto): ResponseEntity<Unit> {
        val success = this.service.createCharacter(auth.principal, id, dto.name, dto.description)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/members")
    fun getCampaignMembers(auth: GoogleAuthentication,
                           @PathVariable id: UUID): ResponseEntity<List<CampaignMemberView>> {
        val map = this.service.getCampaignMembers(auth.principal, id)
        return if (map === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(map.map { CampaignMemberView(it.key.fullName, it.value) }.toList(), HttpStatus.OK)
        }
    }

    @PostMapping("/join/{code}")
    fun joinCampaign(auth: GoogleAuthentication,
                     @PathVariable code: UUID): ResponseEntity<Unit> {
        val success = this.service.joinCampaign(auth.principal, code)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

}

@Component
class CampaignService(private val repository: CampaignRepository) {

    fun getCampaignsForUser(user: User): List<Campaign> = repository.findAll().filter { it.isAccessibleBy(user) }

    fun getCampaign(user: User, id: UUID): Campaign? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isAccessibleBy(user)) {
            return null
        }
        return campaignQuery.orElse(null)
    }

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

    fun joinCampaign(user: User, code: UUID): Boolean {
        val campaignQuery = repository.findByInviteCode(code)
        if (!campaignQuery.isPresent || campaignQuery.get().members.contains(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.members.add(user)
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

    fun getCampaignCharacters(user: User, id: UUID): List<Character>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.characters.filter { campaign.isOwnedBy(user) || it.isVisible }
    }

    fun createCharacter(user: User, id: UUID, name: String, description: String): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        val newCharacter = Character(name, description, false, campaign, mutableListOf())
        campaign.characters.add(newCharacter)
        this.repository.save(campaign)
        return true
    }

    fun getCampaignMembers(user: User, id: UUID): Map<User, Boolean>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.members.map { it to campaign.isOwnedBy(it) }.toMap()
    }
}
