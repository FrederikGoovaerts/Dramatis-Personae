package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.User
import dev.frederik.dramatispersonae.model.note.CharacterNote
import dev.frederik.dramatispersonae.model.note.CharacterNoteRepository
import dev.frederik.dramatispersonae.model.note.NoteVisibility
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/characternote")
class CharacterNoteController(service: CharacterNoteService) : NoteController<CharacterNote>(service)

@Component
class CharacterNoteService(repository: CharacterNoteRepository) : NoteService<CharacterNote>(repository) {

    override fun editAllowed(note: CharacterNote, user: User) =
        note.author == user || (note.visibility != NoteVisibility.PRIVATE && note.character.campaign.isOwnedBy(user))
}
