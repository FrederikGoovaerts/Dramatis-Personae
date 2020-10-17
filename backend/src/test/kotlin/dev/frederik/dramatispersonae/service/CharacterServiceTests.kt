package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.model.*
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.*

class CharacterServiceTests {

    @MockK
    lateinit var characterRepository: CharacterRepository
    @MockK
    lateinit var labelRepository: LabelRepository
    @MockK
    lateinit var relationRepository: CharacterRelationRepository

    lateinit var characterService: CharacterService

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this, relaxUnitFun = true)
        characterService = CharacterService(characterRepository, labelRepository, relationRepository)
    }

    @Test
    fun `updateCharacter should persist a character for a member of the campaign`() {
        val user = mockkClass(User::class)
        val char = mockkClass(Character::class, relaxUnitFun = true)
        val camp = mockkClass(Campaign::class)
        every { char.campaign } returns camp
        every { camp.isOwnedBy(any()) } returns false
        every { camp.isAccessibleBy(any()) } returns true
        every { characterRepository.findById(any()) } returns Optional.of(char)
        every { characterRepository.save<Character>(any()) } returns char
        val result = characterService.updateCharacter(user, UUID.randomUUID(), "name", "desc", true)
        verify { characterRepository.save<Character>(any()) }
        Assertions.assertTrue(result)
    }

    @Test
    fun `updateCharacter should not persist a character for a non-member of the campaign`() {
        val user = mockkClass(User::class)
        val char = mockkClass(Character::class, relaxUnitFun = true)
        val camp = mockkClass(Campaign::class)
        every { char.campaign } returns camp
        every { camp.isOwnedBy(any()) } returns false
        every { camp.isAccessibleBy(any()) } returns false
        every { characterRepository.findById(any()) } returns Optional.of(char)
        every { characterRepository.save<Character>(any()) } returns char
        val result = characterService.updateCharacter(user, UUID.randomUUID(), "name", "desc", true)
        verify(inverse = true) { characterRepository.save<Character>(any()) }
        Assertions.assertFalse(result)
    }

    @Test
    fun `deleteCharacter should delete a character for a member of the campaign`() {
        val user = mockkClass(User::class)
        val char = mockkClass(Character::class, relaxUnitFun = true)
        val camp = mockkClass(Campaign::class)
        every { char.campaign } returns camp
        every { camp.isOwnedBy(any()) } returns false
        every { camp.isAccessibleBy(any()) } returns true
        every { characterRepository.findById(any()) } returns Optional.of(char)
        val result = characterService.deleteCharacter(user, UUID.randomUUID())
        verify { characterRepository.delete(any()) }
        Assertions.assertTrue(result)
    }

    @Test
    fun `deleteCharacter should not delete a character for a non-member of the campaign`() {
        val user = mockkClass(User::class)
        val char = mockkClass(Character::class, relaxUnitFun = true)
        val camp = mockkClass(Campaign::class)
        every { char.campaign } returns camp
        every { camp.isOwnedBy(any()) } returns false
        every { camp.isAccessibleBy(any()) } returns false
        every { characterRepository.findById(any()) } returns Optional.of(char)
        val result = characterService.deleteCharacter(user, UUID.randomUUID())
        verify(inverse = true) { characterRepository.delete(any()) }
        Assertions.assertFalse(result)
    }
}