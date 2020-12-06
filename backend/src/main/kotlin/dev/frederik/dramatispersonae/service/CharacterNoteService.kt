package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.*
import dev.frederik.dramatispersonae.model.note.CharacterNote
import dev.frederik.dramatispersonae.model.note.CharacterNoteRepository
import dev.frederik.dramatispersonae.model.note.NoteVisibility
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/characternote")
class CharacterNoteController(service: CharacterNoteService) : NoteController<CharacterNote>(service)

@Component
class CharacterNoteService(repository: CharacterNoteRepository) : NoteService<CharacterNote>(repository) {

    override fun editAllowed(note: CharacterNote, user: User) = note.author == user || (note.visibility != NoteVisibility.PRIVATE && note.character.campaign.isOwnedBy(user))
}
