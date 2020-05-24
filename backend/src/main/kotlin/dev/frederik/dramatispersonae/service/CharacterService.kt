package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class CreateCharacterDto(val name: String, val description: String)

data class CharacterListView(val name: String, val visible: Boolean, val addedOn: Date, val id: UUID)
data class CharacterDetailView(
    val name: String,
    val description: String,
    val visible: Boolean,
    val addedOn: Date,
    val id: UUID
)

@RestController
@RequestMapping("/api/character")
class CharacterController(private val service: CharacterService) {

    @GetMapping("/{id}")
    fun getCharacter(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<CharacterDetailView> {
        val character = service.getCharacter(auth.principal, id)
        return if (character === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(
                    CharacterDetailView(character.name,
                                        character.description,
                                        character.isVisible,
                                        character.addedOn,
                                        character.id!!),
                    HttpStatus.OK
            )
        }
    }

    @PutMapping("/{id}")
    fun updateCharacter(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody character: CreateCharacterDto
    ): ResponseEntity<Unit> {
        val success = this.service.updateCharacter(auth.principal, id, character.name, character.description)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @PutMapping("/{id}/visible")
    fun updateCharacterVisibility(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody visible: Boolean
    ): ResponseEntity<Unit> {
        val success = this.service.updateCharacterVisibility(auth.principal, id, visible)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteCharacter(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteCharacter(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/note")
    fun getCharacterNoteList(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getCharacterNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

    @GetMapping("/{id}/sharednotes")
    fun getCharacterSharedNotes(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getCharacterSharedNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

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

    @PostMapping("/{id}/note")
    fun createCharacterNote(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateNoteDto
    ): ResponseEntity<Unit> {
        val success = this.service.createNote(auth.principal, id, dto.contents, dto.visibility)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }
}

@Component
class CharacterService(private val repository: CharacterRepository) {

    fun getCharacter(user: User, id: UUID): Character? {
        val characterQuery = this.repository.findById(id)
        return if (!characterQuery.isPresent || !characterQuery.get().campaign.isAccessibleBy(user)) {
            null
        } else {
            characterQuery.get()
        }
    }

    fun updateCharacter(user: User, id: UUID, name: String, description: String): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent || !characterQuery.get().campaign.isOwnedBy(user)) {
            return false
        }
        val character = characterQuery.get()
        character.name = name
        character.description = description
        this.repository.save(character)
        return true
    }

    fun updateCharacterVisibility(user: User, id: UUID, visible: Boolean): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent || !characterQuery.get().campaign.isOwnedBy(user)) {
            return false
        }
        val character = characterQuery.get()
        character.isVisible = visible
        this.repository.save(character)
        return true
    }

    fun deleteCharacter(user: User, id: UUID): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent || !characterQuery.get().campaign.isOwnedBy(user)) {
            return false
        }
        repository.delete(characterQuery.get())
        return true
    }

    fun getCharacterNotes(user: User, characterId: UUID): List<Note>? {
        val characterQuery = repository.findById(characterId)
        if (!characterQuery.isPresent || !(characterQuery.get().campaign.members.contains(user))) {
            return null
        }
        val character = characterQuery.get()
        return character.notes.filter { it.author == user }
    }

    fun getCharacterSharedNotes(user: User, characterId: UUID): List<Note>? {
        val characterQuery = repository.findById(characterId)
        if (!characterQuery.isPresent || !(characterQuery.get().campaign.members.contains(user))) {
            return null
        }
        val character = characterQuery.get()
        return if (character.campaign.isOwnedBy(user)) {
            character.notes.filter {
                it.author != user &&
                        (it.visibility === NoteVisibility.DM_SHARED || it.visibility === NoteVisibility.PUBLIC)
            }
        } else {
            character.notes.filter { it.author != user && it.visibility === NoteVisibility.PUBLIC }
        }
    }

    fun createNote(user: User, id: UUID, contents: String, rawVisibility: String): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent || !characterQuery.get().campaign.members.contains(user)) {
            return false
        }
        val visibility = try { NoteVisibility.valueOf(rawVisibility) } catch (e: IllegalArgumentException) { return false }
        val character = characterQuery.get()
        val newNote = Note(contents, user, character, visibility)
        character.notes.add(newNote)
        this.repository.save(character)
        return true
    }
}
