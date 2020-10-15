package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class CharacterRelationDto(val origin: UUID, val destination: UUID, val relation: String)

data class CharacterRelationCharacterView(val id: UUID, val name: String)
data class CharacterRelationView(val origin: CharacterRelationCharacterView, val destination: CharacterRelationCharacterView, val relation: String, val id: UUID)

@RestController
@RequestMapping("/api/charrelation")
class CharacterRelationController(private val service: CharacterRelationService) {

    @PostMapping
    fun createRelation(auth: GoogleAuthentication, @RequestBody dto: CharacterRelationDto): ResponseEntity<Unit> {
        val success = this.service.createRelation(auth.principal, dto.origin, dto.destination, dto.relation)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}")
    fun getRelations(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<List<CharacterRelationView>> {
        val result = this.service.getRelations(auth.principal, id)
        return if (result == null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(result.map {
                rel -> CharacterRelationView(
                    CharacterRelationCharacterView(rel.origin.id!!, rel.origin.name),
                    CharacterRelationCharacterView(rel.destination.id!!, rel.destination.name),
                    rel.relation,
                    rel.id!!)
            }, HttpStatus.OK)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteRelation(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteRelation(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class CharacterRelationService(private val repository: CharacterRelationRepository,
                               private val characterRepository: CharacterRepository) {

    private fun editAllowed(user: User, char1: Character, char2: Character): Boolean {
        if (char1.campaign != char2.campaign) {
            return false
        }
        val camp = char1.campaign
        if (!camp.isAccessibleBy(user)) {
            return false
        }
        if (!camp.isOwnedBy(user) && (!char1.isVisible || !char2.isVisible)) {
            return false
        }
        return true
    }

    fun createRelation(user: User, originId: UUID, destinationId: UUID, relationText: String): Boolean {
        val origQuery = characterRepository.findById(originId)
        val destQuery = characterRepository.findById(destinationId)
        if (origQuery.isEmpty || destQuery.isEmpty) {
            return false
        }
        val orig = origQuery.get()
        val dest = destQuery.get()
        if (orig == dest) {
            return false
        }
        val editAllowed = this.editAllowed(user, orig, dest)
        if (!editAllowed) {
            return false
        }
        val relation = CharacterRelation(relationText, orig, dest)
        this.repository.save(relation)
        return true
    }

    fun getRelations(user: User, charId: UUID): List<CharacterRelation>? {
        val charQuery = this.characterRepository.findById(charId)
        if (charQuery.isEmpty || !charQuery.get().campaign.isAccessibleBy(user)) {
            return null
        }
        val char = charQuery.get()
        val filter: (CharacterRelation) -> Boolean =
                if (char.campaign.isOwnedBy(user)) { _: CharacterRelation -> true } else { rel -> rel.origin.isVisible && rel.destination.isVisible }
        val result = mutableListOf<CharacterRelation>()
        result.addAll(this.repository.findByOrigin(char).filter(filter))
        result.addAll(this.repository.findByDestination(char).filter(filter))
        return result
    }

    fun deleteRelation(user: User, id: UUID): Boolean {
        val query = repository.findById(id)
        if (query.isEmpty || !this.editAllowed(user, query.get().origin, query.get().destination)) {
            return false
        }
        repository.delete(query.get())
        return true
    }
}
