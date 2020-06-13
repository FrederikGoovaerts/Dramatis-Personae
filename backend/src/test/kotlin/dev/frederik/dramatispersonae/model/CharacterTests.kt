package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.fixtures.getTestCharacter
import dev.frederik.dramatispersonae.fixtures.getTestCharacterNote
import dev.frederik.dramatispersonae.fixtures.getTestLabel
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

    var character: Character = getTestCharacter()

    @BeforeEach
    fun beforeEach() {
        userRepository.save(character.campaign.owner)
        campaignRepository.save(character.campaign)
        characterRepository.save(character)
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
        val label = getTestLabel(campaign = character.campaign)
        labelRepository.save(label)
        character.labels.add(label)
        characterRepository.save(character)
        assertThat(characterRepository.findAll().count()).isEqualTo(1)
        assertThat(labelRepository.findAll().count()).isEqualTo(1)

        characterRepository.delete(character)

        assertThat(characterRepository.findAll().count()).isEqualTo(0)
        assertThat(labelRepository.findAll().count()).isEqualTo(1)
    }

}
