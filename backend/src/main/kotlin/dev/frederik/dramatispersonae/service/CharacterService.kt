package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import dev.frederik.dramatispersonae.model.note.CharacterNote
import dev.frederik.dramatispersonae.model.note.NoteVisibility
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class CreateCharacterDto(val name: String, val description: String, val visible: Boolean)

data class MergeCharacterDto(val target: UUID)

data class CharacterListView(
    val name: String,
    val description: String,
    val labels: List<LabelListView>,
    val visible: Boolean,
    val id: UUID
)
data class CharacterDetailView(
    val name: String,
    val description: String,
    val labels: List<LabelView>,
    val visible: Boolean,
    val id: UUID
)

fun sortCharacters(list: List<Character>) = list.sortedBy { character -> character.name.toLowerCase() }

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
                                        character.labels.map { LabelView(it.name, it.id!!, it.isVisible) },
                                        character.isVisible,
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
        val success = this.service.updateCharacter(auth.principal, id, character.name, character.description, character.visible)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/{id}/merge")
    fun mergeCharacter(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody merge: MergeCharacterDto
    ): ResponseEntity<Unit> {
        val success = this.service.mergeCharacter(auth.principal, id, merge.target)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteCharacter(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteCharacter(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/note")
    fun getNoteList(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

    @GetMapping("/{id}/sharednotes")
    fun getSharedNotes(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getSharedNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

    @PostMapping("/{id}/note")
    fun createNote(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateNoteDto
    ): ResponseEntity<Unit> {
        val success = this.service.createNote(auth.principal, id, dto.contents, dto.visibility)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/{id}/label")
    fun addLabel(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody labelId: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.addLabel(auth.principal, id, labelId)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}/label/{labelId}")
    fun removeLabel(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @PathVariable labelId: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.removeLabel(auth.principal, id, labelId)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class CharacterService(private val repository: CharacterRepository,
                       private val labelRepository: LabelRepository,
                       private val relationRepository: CharacterRelationRepository) {

    fun getCharacter(user: User, id: UUID): Character? {
        val characterQuery = this.repository.findById(id)
        return if (!characterQuery.isPresent || !characterQuery.get().campaign.isAccessibleBy(user)) {
            null
        } else {
            val filteredCharacter = characterQuery.get()
            filteredCharacter.labels = filteredCharacter.labels.filter { it.isVisible || filteredCharacter.campaign.isOwnedBy(user) }.toMutableList()
            return filteredCharacter
        }
    }

    fun updateCharacter(user: User, id: UUID, name: String, description: String, visible: Boolean): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent) {
            return false
        }
        val character = characterQuery.get()
        if (!character.campaign.isAccessibleBy(user)) {
            return false
        }
        character.name = name
        character.description = description
        character.isVisible = visible
        this.repository.save(character)
        return true
    }

    fun mergeCharacter(user: User, id: UUID, target: UUID): Boolean {
        if (id == target) {
            return false
        }
        val sourceCharacterQuery = repository.findById(id)
        val targetCharacterQuery = repository.findById(target)
        if (!sourceCharacterQuery.isPresent || !targetCharacterQuery.isPresent) {
            return false
        }
        val sourceCharacter = sourceCharacterQuery.get()
        val targetCharacter = targetCharacterQuery.get()
        if (sourceCharacter.campaign != targetCharacter.campaign) {
            return false;
        }
        val isCharacterAllowed = { char: Character ->
            char.campaign.isOwnedBy(user) || (char.isVisible && char.campaign.isAccessibleBy(user))
        }
        if (!isCharacterAllowed(sourceCharacter) || !isCharacterAllowed(targetCharacter)) {
            return false
        }
        targetCharacter.labels.addAll(sourceCharacter.labels.filter { label -> !targetCharacter.labels.contains(label) })
        targetCharacter.notes.addAll(sourceCharacter.notes)
        sourceCharacter.notes.forEach { note -> note.character = targetCharacter }
        sourceCharacter.notes.clear()
        targetCharacter.description += ("\n\n" + sourceCharacter.description)

        val originRelations = this.relationRepository.findByOrigin(sourceCharacter)
        val destinationRelations = this.relationRepository.findByDestination(sourceCharacter)

        for (rel in originRelations) {
            if (rel.destination == targetCharacter) {
                relationRepository.delete(rel)
            } else {
                rel.origin = targetCharacter
                relationRepository.save(rel)
            }
        }

        for (rel in destinationRelations) {
            if (rel.origin == targetCharacter) {
                relationRepository.delete(rel)
            } else {
                rel.destination = targetCharacter
                relationRepository.save(rel)
            }
        }

        this.repository.save(targetCharacter)
        this.repository.delete(sourceCharacter)
        return true
    }

    fun deleteCharacter(user: User, id: UUID): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent) {
            return false
        }
        val character = characterQuery.get()
        if (!character.campaign.isAccessibleBy(user)) {
            return false
        }
        repository.delete(characterQuery.get())
        return true
    }

    fun getNotes(user: User, characterId: UUID): List<CharacterNote>? {
        val characterQuery = repository.findById(characterId)
        if (!characterQuery.isPresent || !(characterQuery.get().campaign.members.contains(user))) {
            return null
        }
        val character = characterQuery.get()
        val notes = character.notes.filter { it.author == user }
        return sortNotes(notes)
    }

    fun getSharedNotes(user: User, characterId: UUID): List<CharacterNote>? {
        val characterQuery = repository.findById(characterId)
        if (!characterQuery.isPresent || !(characterQuery.get().campaign.members.contains(user))) {
            return null
        }
        val character = characterQuery.get()
        return sortNotes(if (character.campaign.isOwnedBy(user)) {
            character.notes.filter {
                it.author != user &&
                        (it.visibility === NoteVisibility.DM_SHARED || it.visibility === NoteVisibility.PUBLIC)
            }
        } else {
            character.notes.filter { it.author != user && it.visibility === NoteVisibility.PUBLIC }
        })
    }

    fun createNote(user: User, id: UUID, contents: String, rawVisibility: String): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent || !characterQuery.get().campaign.members.contains(user)) {
            return false
        }
        val visibility = try { NoteVisibility.valueOf(rawVisibility) } catch (e: IllegalArgumentException) { return false }
        val character = characterQuery.get()
        val newNote = CharacterNote(contents, user, character, visibility)
        character.notes.add(newNote)
        this.repository.save(character)
        return true
    }

    fun addLabel(user: User, id: UUID, labelId: UUID): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent) {
            return false
        }
        val character = characterQuery.get()
        if (character.labels.any { it.id == labelId }) {
            return false
        }
        if (!character.campaign.isAccessibleBy(user)) {
            return false
        }
        val labelQuery = labelRepository.findById(labelId)
        if (!labelQuery.isPresent || labelQuery.get().campaign != character.campaign) {
            return false
        }
        val label = labelQuery.get()
        character.labels.add(label)
        repository.save(character)
        return true
    }

    fun removeLabel(user: User, id: UUID, labelId: UUID): Boolean {
        val characterQuery = repository.findById(id)
        if (!characterQuery.isPresent) {
            return false
        }
        val character = characterQuery.get()
        if (!character.campaign.isAccessibleBy(user)) {
            return false
        }
        val label = character.labels.find { it.id == labelId } ?: return false
        character.labels.remove(label)
        repository.save(character)
        return true
    }
}
