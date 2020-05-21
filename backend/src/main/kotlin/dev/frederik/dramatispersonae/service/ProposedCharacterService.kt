package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class ProposedCharacterView(
    val name: String,
    val description: String,
    val proposedOn: Date,
    val proposedBy: String,
    val id: UUID
)

@RestController
@RequestMapping("/api/proposedcharacter")
class ProposedCharacterController(private val service: ProposedCharacterService) {

    @PutMapping("/{id}/accept")
    fun acceptProposedCharacter(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.acceptProposedCharacter(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteProposedCharacter(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteProposedCharacter(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class ProposedCharacterService(
    private val repository: ProposedCharacterRepository,
    private val campaignRepository: CampaignRepository
) {

    fun acceptProposedCharacter(user: User, id: UUID): Boolean {
        val proposedCharacterQuery = repository.findById(id)
        if (!proposedCharacterQuery.isPresent || !proposedCharacterQuery.get().campaign.isOwnedBy(user)) {
            return false
        }
        val proposedCharacter = proposedCharacterQuery.get()
        val character = Character(
            proposedCharacter.name,
            proposedCharacter.description,
            true,
            proposedCharacter.campaign
        )
        proposedCharacter.campaign.characters.add(character)
        proposedCharacter.campaign.proposedCharacters.remove(proposedCharacter)
        this.campaignRepository.save(proposedCharacter.campaign)
        this.repository.delete(proposedCharacter)
        return true
    }

    fun deleteProposedCharacter(user: User, id: UUID): Boolean {
        val proposedCharacterQuery = repository.findById(id)
        if (!proposedCharacterQuery.isPresent ||
            (!proposedCharacterQuery.get().campaign.isOwnedBy(user) &&
                proposedCharacterQuery.get().proposedBy != user)) {
            return false
        }
        repository.delete(proposedCharacterQuery.get())
        return true
    }
}
