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
class CampaignTests constructor(@Autowired val userRepository: UserRepository,
                                @Autowired val campaignRepository: CampaignRepository,
                                @Autowired val characterRepository: CharacterRepository,
                                @Autowired val proposedCharacterRepository: ProposedCharacterRepository,
                                @Autowired val labelRepository: LabelRepository,
                                @Autowired val campaignNoteRepository: CampaignNoteRepository) {

    lateinit var player: User
    lateinit var campaign: Campaign

    @BeforeEach
    fun beforeEach() {
        player = userRepository.save(getTestUser())
        val owner = userRepository.save(getTestUser())
        campaign = getTestCampaign(owner = owner)
        campaign.members.add(player)
        campaign.characters.addAll(listOf(getTestCharacter(campaign = campaign), getTestCharacter(campaign = campaign)))
        campaign.proposedCharacters.addAll(listOf(
            getTestProposedCharacter(campaign = campaign, proposedBy = player),
            getTestProposedCharacter(campaign = campaign, proposedBy = player)
        ))
        campaign.notes.addAll(listOf(
            getTestCampaignNote(campaign = campaign, user = player),
            getTestCampaignNote(campaign = campaign, user = player)
        ))
        campaign.labels.addAll(listOf(getTestLabel(campaign = campaign), getTestLabel(campaign = campaign)))
        campaign = campaignRepository.save(campaign)
    }

    @Test
    fun `deleting a campaign should not delete the owner`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(userRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(userRepository.findAll().count()).isEqualTo(2)
    }

    @Test
    fun `deleting a campaign should not delete any member`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(userRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(userRepository.findAll().count()).isEqualTo(2)
    }

    @Test
    fun `deleting a campaign should delete its characters`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(characterRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(characterRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `deleting a campaign should delete its proposed characters`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(proposedCharacterRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(proposedCharacterRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `deleting a campaign should delete its notes`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(campaignNoteRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(campaignNoteRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `deleting a campaign should delete its labels`() {
        assertThat(campaignRepository.findAll().count()).isEqualTo(1)
        assertThat(labelRepository.findAll().count()).isEqualTo(2)

        campaignRepository.delete(campaign)

        assertThat(campaignRepository.findAll().count()).isEqualTo(0)
        assertThat(labelRepository.findAll().count()).isEqualTo(0)
    }

    @Test
    fun `isAccessibleBy should return true for a member`() {
        for (member in campaign.members) {
            assertThat(campaign.isAccessibleBy(member)).isEqualTo(true)
        }
    }

    @Test
    fun `isAccessibleBy should return false for a non-member`() {
        assertThat(campaign.isAccessibleBy(getTestUser())).isEqualTo(false)
    }

    @Test
    fun `isOwnedBy should return true for the owner`() {
        assertThat(campaign.isOwnedBy(campaign.owner)).isEqualTo(true)
    }

    @Test
    fun `isOwnedBy should return false for a non-owner`() {
        for (member in campaign.members) {
            if (member != campaign.owner) {
                assertThat(campaign.isOwnedBy(member)).isEqualTo(false)
            }
        }
        assertThat(campaign.isOwnedBy(getTestUser())).isEqualTo(false)
    }

}
