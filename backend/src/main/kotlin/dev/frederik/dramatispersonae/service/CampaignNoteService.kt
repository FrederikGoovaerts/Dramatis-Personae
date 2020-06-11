package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.*
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/campaignnote")
class CampaignNoteController(service: CampaignNoteService) : NoteController<CampaignNote>(service)

@Component
class CampaignNoteService(repository: CampaignNoteRepository) : NoteService<CampaignNote>(repository) {

    override fun editAllowed(note: CampaignNote, user: User) = note.author == user || (note.visibility != NoteVisibility.PRIVATE && note.campaign.isOwnedBy(user))
}
