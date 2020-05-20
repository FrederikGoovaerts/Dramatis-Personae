package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class CreateNoteDto(val contents: String, val visibility: String)

data class NoteView(val contents: String, val authorName: String, val visibility: NoteVisibility, val addedOn: Date, val editedOn: Date, val id: UUID)

@RestController
@RequestMapping("/api/note")
class NoteController(private val service: NoteService) {

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
class NoteService(private val repository: NoteRepository) {

    fun updateNote(user: User, id: UUID, contents: String, rawVisibility: String): Boolean {
        val noteQuery = repository.findById(id)
        if (!noteQuery.isPresent || noteQuery.get().author != user) {
            return false
        }
        val visibility = try { NoteVisibility.valueOf(rawVisibility) } catch (e: IllegalArgumentException) { return false }
        val note = noteQuery.get()
        note.contents = contents
        note.editedOn = Date()
        note.visibility = visibility
        this.repository.save(note)
        return true
    }

    fun deleteNote(user: User, id: UUID): Boolean {
        val noteQuery = repository.findById(id)
        if (!noteQuery.isPresent || noteQuery.get().author != user) {
            return false
        }
        repository.delete(noteQuery.get())
        return true
    }
}
