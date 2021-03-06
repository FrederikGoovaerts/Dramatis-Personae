package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.fixtures.getTestCampaignNote
import dev.frederik.dramatispersonae.fixtures.getTestUser
import dev.frederik.dramatispersonae.model.note.CampaignNoteRepository
import dev.frederik.dramatispersonae.model.note.NoteVisibility
import io.mockk.MockKAnnotations
import io.mockk.impl.annotations.MockK
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CampaignNoteServiceTests {

    @MockK
    lateinit var campaignNoteRepository: CampaignNoteRepository

    lateinit var campaignNoteService: CampaignNoteService

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        campaignNoteService = CampaignNoteService(campaignNoteRepository)
    }

    @Test
    fun `editAllowed should return true for the owner of the note`() {
        val noteOwner = getTestUser(name = "noteOwner")
        val note = getTestCampaignNote(user = noteOwner)
        Assertions.assertTrue(campaignNoteService.editAllowed(note, noteOwner))
    }

    @Test
    fun `editAllowed should return false for the other users if the note is private`() {
        val campaignOwner = getTestUser(name = "campaignOwner")
        val campaignMember = getTestUser(name = "campaignMember")
        val unrelatedUser = getTestUser(name = "unrelatedUser")
        val note = getTestCampaignNote(visibility = NoteVisibility.PRIVATE)
        note.campaign.owner = campaignOwner
        note.campaign.members.add(campaignMember)
        Assertions.assertFalse(campaignNoteService.editAllowed(note, campaignOwner))
        Assertions.assertFalse(campaignNoteService.editAllowed(note, campaignMember))
        Assertions.assertFalse(campaignNoteService.editAllowed(note, unrelatedUser))
    }

    @Test
    fun `editAllowed should return true for the owner of the campaign if the note is public`() {
        val campaignOwner = getTestUser(name = "campaignOwner")
        val note = getTestCampaignNote(visibility = NoteVisibility.PUBLIC)
        note.campaign.owner = campaignOwner
        Assertions.assertTrue(campaignNoteService.editAllowed(note, campaignOwner))
    }

    @Test
    fun `editAllowed should return true for the owner of the campaign if the note is shared with the dm`() {
        val campaignOwner = getTestUser(name = "campaignOwner")
        val note = getTestCampaignNote(visibility = NoteVisibility.DM_SHARED)
        note.campaign.owner = campaignOwner
        Assertions.assertTrue(campaignNoteService.editAllowed(note, campaignOwner))
    }
}