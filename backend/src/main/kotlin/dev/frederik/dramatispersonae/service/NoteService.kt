package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.*

data class CreateNoteDto(val contents: String)

data class NoteView(val contents: String, val addedOn: Date, val editedOn: Date, val id: UUID)

@RestController
@RequestMapping("/api/note")
class NoteController(private val service: NoteService) {

    @PutMapping("/{id}")
    fun updateNote(auth: GoogleAuthentication,
                   @PathVariable id: UUID,
                   @RequestBody note: CreateNoteDto): ResponseEntity<Unit> {
        val success = this.service.updateNote(auth.principal, id, note.contents)
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

    fun updateNote(user: User, id: UUID, contents: String): Boolean {
        val noteQuery = repository.findById(id)
        if (!noteQuery.isPresent || noteQuery.get().author != user) {
            return false
        }
        val note = noteQuery.get()
        note.contents = contents
        note.editedOn = Date()
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
