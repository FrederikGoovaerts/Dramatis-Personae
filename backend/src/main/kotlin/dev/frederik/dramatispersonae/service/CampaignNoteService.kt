package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/campaignnote")
class CampaignNoteController(private val service: CampaignNoteService) {

    @PutMapping("/{id}")
    fun updateNote(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody note: CreateNoteDto
    ): ResponseEntity<Unit> {
        val success = this.service.updateNote(auth.principal, id, note.contents, note.visibility)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteNote(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteNote(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class CampaignNoteService(repository: CampaignNoteRepository) : NoteService<CampaignNote>(repository) {

    override fun editAllowed(note: CampaignNote, user: User) = note.author == user || (note.visibility != NoteVisibility.PRIVATE && note.campaign.isOwnedBy(user))
}
