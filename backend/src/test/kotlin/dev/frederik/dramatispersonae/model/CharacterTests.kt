package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.fixtures.*
import dev.frederik.dramatispersonae.model.note.CharacterNoteRepository
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.test.context.ActiveProfiles

@DataJpaTest
@ActiveProfiles("test")
class CharacterTests constructor(@Autowired val userRepository: UserRepository,
                                 @Autowired val campaignRepository: CampaignRepository,
                                 @Autowired val characterRepository: CharacterRepository,
                                 @Autowired val labelRepository: LabelRepository,
                                 @Autowired val noteRepository: CharacterNoteRepository
) {

    lateinit var character: Character

    @BeforeEach
    fun beforeEach() {
        val owner = userRepository.save(getTestUser())
        val campaign = campaignRepository.save(getTestCampaign(owner = owner))
        character = characterRepository.save(getTestCharacter(campaign = campaign))
    }

    @Test
    fun `deleting a character should not delete its campaign`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(1, characterRepository.findAll().count())

        characterRepository.delete(character)

        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(0, characterRepository.findAll().count())
    }

    @Test
    fun `deleting a character should delete a contained note`() {
        character.notes.add(getTestCharacterNote(user = character.campaign.owner, character = character))
        characterRepository.save(character)
        Assertions.assertEquals(1, characterRepository.findAll().count())
        Assertions.assertEquals(1, noteRepository.findAll().count())

        characterRepository.delete(character)

        Assertions.assertEquals(0, characterRepository.findAll().count())
        Assertions.assertEquals(0, noteRepository.findAll().count())
    }

    @Test
    fun `deleting a character should not delete a contained label`() {
        val label = labelRepository.save(getTestLabel(campaign = character.campaign))
        character.labels.add(label)
        characterRepository.save(character)
        Assertions.assertEquals(1, characterRepository.findAll().count())
        Assertions.assertEquals(1, labelRepository.findAll().count())

        characterRepository.delete(character)

        Assertions.assertEquals(0, characterRepository.findAll().count())
        Assertions.assertEquals(1, labelRepository.findAll().count())
    }

}
