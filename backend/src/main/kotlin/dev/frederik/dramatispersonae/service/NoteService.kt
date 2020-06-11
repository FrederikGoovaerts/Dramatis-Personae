package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.data.repository.CrudRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody

data class CreateNoteDto(val contents: String, val visibility: String)

data class NoteView(
    val contents: String,
    val authorName: String,
    val visibility: NoteVisibility,
    val addedOn: Date,
    val editedOn: Date,
    val owned: Boolean,
    val id: UUID
)

fun returnNotes(list: List<Note>?, user: User): ResponseEntity<List<NoteView>> {
    return if (list === null) {
        ResponseEntity(HttpStatus.FORBIDDEN)
    } else {
        ResponseEntity(list.map {
            NoteView(
                    it.contents,
                    it.author.fullName,
                    it.visibility,
                    it.addedOn,
                    it.editedOn,
                    it.author == user,
                    it.id!!
            )
        }, HttpStatus.OK)
    }
}

fun <T : Note> sortNotes(list: List<T>) = list.sortedByDescending { note -> note.addedOn }

abstract class NoteController<T : Note>(private val service: NoteService<T>) {

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

abstract class NoteService<T : Note>(private val repository: CrudRepository<T, UUID>) {

    abstract fun editAllowed(note: T, user: User): Boolean

    fun updateNote(user: User, id: UUID, contents: String, rawVisibility: String): Boolean {
        val noteQuery = repository.findById(id)
        if (!noteQuery.isPresent) {
            return false
        }
        val note = noteQuery.get()
        val editAllowed = this.editAllowed(note, user)
        if (!editAllowed) {
            return false
        }
        note.contents = contents
        note.editedOn = Date()
        if (note.author == user) {
            val visibility = try { NoteVisibility.valueOf(rawVisibility) } catch (e: IllegalArgumentException) { return false }
            note.visibility = visibility
        }
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
