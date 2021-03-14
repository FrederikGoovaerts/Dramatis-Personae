package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.*
import dev.frederik.dramatispersonae.model.note.CharacterNote
import dev.frederik.dramatispersonae.model.note.CharacterNoteRepository
import dev.frederik.dramatispersonae.model.note.NoteVisibility
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.mockkClass
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class CharacterNoteServiceTests {

    @MockK
    lateinit var characterNoteRepository: CharacterNoteRepository

    lateinit var characterNoteService: CharacterNoteService

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        characterNoteService = CharacterNoteService(characterNoteRepository)
    }

    @Test
    fun `editAllowed should return true for the owner of the note`() {
        val noteOwner = mockkClass(User::class)
        val note = mockkClass(CharacterNote::class)
        every { note.author } returns noteOwner
        Assertions.assertTrue(characterNoteService.editAllowed(note, noteOwner))
    }

    @Test
    fun `editAllowed should return false for the other users if the note is private`() {
        val camp = mockkClass(Campaign::class)
        val char = mockkClass(Character::class)
        val campaignOwner = mockkClass(User::class)
        val noteOwner = mockkClass(User::class)
        val unrelatedUser = mockkClass(User::class)
        val note = mockkClass(CharacterNote::class)
        every { note.visibility } returns NoteVisibility.PRIVATE
        every { note.character } returns char
        every { char.campaign } returns camp
        every { camp.isOwnedBy(eq(campaignOwner)) } returns true
        every { note.author } returns noteOwner
        Assertions.assertFalse(characterNoteService.editAllowed(note, campaignOwner))
        Assertions.assertFalse(characterNoteService.editAllowed(note, unrelatedUser))
    }

    @Test
    fun `editAllowed should return true for the owner of the campaign if the note is public`() {
        val camp = mockkClass(Campaign::class)
        val char = mockkClass(Character::class)
        val campaignOwner = mockkClass(User::class)
        val noteOwner = mockkClass(User::class)
        val note = mockkClass(CharacterNote::class)
        every { note.visibility } returns NoteVisibility.PUBLIC
        every { note.character } returns char
        every { char.campaign } returns camp
        every { camp.isOwnedBy(eq(campaignOwner)) } returns true
        every { note.author } returns noteOwner
        Assertions.assertTrue(characterNoteService.editAllowed(note, campaignOwner))
    }

    @Test
    fun `editAllowed should return true for the owner of the campaign if the note is shared with the dm`() {
        val camp = mockkClass(Campaign::class)
        val char = mockkClass(Character::class)
        val campaignOwner = mockkClass(User::class)
        val noteOwner = mockkClass(User::class)
        val note = mockkClass(CharacterNote::class)
        every { note.visibility } returns NoteVisibility.DM_SHARED
        every { note.character } returns char
        every { char.campaign } returns camp
        every { camp.isOwnedBy(eq(campaignOwner)) } returns true
        every { note.author } returns noteOwner
        Assertions.assertTrue(characterNoteService.editAllowed(note, campaignOwner))
    }
}