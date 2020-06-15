package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.fixtures.*
import org.assertj.core.api.Assertions.assertThat
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
                                 @Autowired val noteRepository: CharacterNoteRepository) {

    lateinit var character: Character

    @BeforeEach
    fun beforeEach() {
        val owner = userRepository.save(getTestUser())
        val campaign = campaignRepository.save(getTestCampaign(owner = owner))
        character = characterRepository.save(getTestCharacter(campaign = campaign))
    }

    @Test
    fun `deleting a character should not delete its campaign`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(characterRepository.findAll().count()).isEqualTo(1)

        characterRepository.delete(character)

        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(characterRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `deleting a character should delete a contained note`() {
        character.notes.add(getTestCharacterNote(user = character.campaign.owner, character = character))
        characterRepository.save(character)
        assertThat(characterRepository.findAll().count()).isEqualTo(1)
        assertThat(noteRepository.findAll().count()).isEqualTo(1)

        characterRepository.delete(character)

        assertThat(characterRepository.findAll().count()).isEqualTo(0)
        assertThat(noteRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `deleting a character should not delete a contained label`() {
        val label = labelRepository.save(getTestLabel(campaign = character.campaign))
        character.labels.add(label)
        characterRepository.save(character)
        assertThat(characterRepository.findAll().count()).isEqualTo(1)
        assertThat(labelRepository.findAll().count()).isEqualTo(1)

        characterRepository.delete(character)

        assertThat(characterRepository.findAll().count()).isEqualTo(0)
        assertThat(labelRepository.findAll().count()).isEqualTo(1)
    }

}
