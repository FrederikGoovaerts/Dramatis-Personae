package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.fixtures.*
import org.junit.jupiter.api.Assertions
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
        campaign.notes.addAll(listOf(
            getTestCampaignNote(campaign = campaign, user = player),
            getTestCampaignNote(campaign = campaign, user = player)
        ))
        campaign.labels.addAll(listOf(getTestLabel(campaign = campaign), getTestLabel(campaign = campaign)))
        campaign = campaignRepository.save(campaign)
    }

    @Test
    fun `deleting a campaign should not delete the owner`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(2, userRepository.findAll().count())

        campaignRepository.delete(campaign)

        Assertions.assertEquals(0, campaignRepository.findAll().count())
        Assertions.assertEquals(2, userRepository.findAll().count())
    }

    @Test
    fun `deleting a campaign should not delete any member`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(2, userRepository.findAll().count())

        campaignRepository.delete(campaign)

        Assertions.assertEquals(0, campaignRepository.findAll().count())
        Assertions.assertEquals(2, userRepository.findAll().count())
    }

    @Test
    fun `deleting a campaign should delete its characters`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(2, characterRepository.findAll().count())

        campaignRepository.delete(campaign)

        Assertions.assertEquals(0, campaignRepository.findAll().count())
        Assertions.assertEquals(0, characterRepository.findAll().count())
    }

    @Test
    fun `deleting a campaign should delete its notes`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(2, campaignNoteRepository.findAll().count())

        campaignRepository.delete(campaign)

        Assertions.assertEquals(0, campaignRepository.findAll().count())
        Assertions.assertEquals(0, campaignNoteRepository.findAll().count())
    }

    @Test
    fun `deleting a campaign should delete its labels`() {
        Assertions.assertEquals(1, campaignRepository.findAll().count())
        Assertions.assertEquals(2, labelRepository.findAll().count())

        campaignRepository.delete(campaign)

        Assertions.assertEquals(0, campaignRepository.findAll().count())
        Assertions.assertEquals(0, labelRepository.findAll().count())
    }

    @Test
    fun `isAccessibleBy should return true for a member`() {
        for (member in campaign.members) {
            Assertions.assertEquals(true, campaign.isAccessibleBy(member))
        }
    }

    @Test
    fun `isAccessibleBy should return false for a non-member`() {
        Assertions.assertEquals(false, campaign.isAccessibleBy(getTestUser()))
    }

    @Test
    fun `isOwnedBy should return true for the owner`() {
        Assertions.assertEquals(true, campaign.isOwnedBy(campaign.owner))
    }

    @Test
    fun `isOwnedBy should return false for a non-owner`() {
        for (member in campaign.members) {
            if (member != campaign.owner) {
                Assertions.assertEquals(false, campaign.isOwnedBy(member))
            }
        }
        Assertions.assertEquals(false, campaign.isOwnedBy(getTestUser()))
    }

}
