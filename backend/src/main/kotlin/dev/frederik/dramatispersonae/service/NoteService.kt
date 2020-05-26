package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.data.repository.CrudRepository

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
