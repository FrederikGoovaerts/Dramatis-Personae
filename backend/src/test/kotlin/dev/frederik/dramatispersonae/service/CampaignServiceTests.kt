package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.fixtures.getTestCampaign
import dev.frederik.dramatispersonae.fixtures.getTestCharacter
import dev.frederik.dramatispersonae.fixtures.getTestUser
import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.Character
import dev.frederik.dramatispersonae.model.LabelRepository
import dev.frederik.dramatispersonae.model.User
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.util.*

class CampaignControllerTests {

    @MockK
    lateinit var campaignService: CampaignService

    @MockK
    lateinit var googleAuthentication: GoogleAuthentication

    private val user = getTestUser()

    lateinit var campaignController: CampaignController

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        every { googleAuthentication.principal } returns user
        campaignController = CampaignController(campaignService)
    }

    @Test
    fun `getting campaigns should correctly return campaign views`() {
        val campaign1 = getTestCampaign(name = "campaign1", owner = user)
        val campaign2 = getTestCampaign(name = "campaign2")
        every { campaignService.getCampaignsForUser(user) } returns mutableListOf(campaign1, campaign2)
        val campaigns = campaignController.getCampaigns(googleAuthentication)
        Assertions.assertEquals(campaigns.size, 2)
        Assertions.assertEquals(campaigns[0].name, "campaign1")
        Assertions.assertEquals(campaigns[0].owner, true)
        Assertions.assertEquals(campaigns[1].name, "campaign2")
        Assertions.assertEquals(campaigns[1].owner, false)
    }

    @Test
    fun `getting an accessible campaign should correctly return a campaign view`() {
        val campaign1 = getTestCampaign(name = "campaign1", owner = user)
        every { campaignService.getCampaign(user, any()) } returns campaign1
        val campaign = campaignController.getCampaign(googleAuthentication, UUID.randomUUID())
        Assertions.assertEquals(campaign.statusCode, HttpStatus.OK)
        Assertions.assertEquals(campaign.body?.name, "campaign1")
        Assertions.assertEquals(campaign.body?.owner, true)
    }

    @Test
    fun `getting an inaccessible campaign should return forbidden`() {
        every { campaignService.getCampaign(user, any()) } returns null
        val campaign = campaignController.getCampaign(googleAuthentication, UUID.randomUUID())
        Assertions.assertEquals(campaign.statusCode, HttpStatus.FORBIDDEN)
        Assertions.assertEquals(campaign.body, null)
    }
}

class CampaignServiceTests {

    @MockK
    lateinit var campaignRepository: CampaignRepository
    @MockK
    lateinit var labelRepository: LabelRepository

    lateinit var campaignService: CampaignService

    @BeforeEach
    fun beforeEach() {
        MockKAnnotations.init(this)
        campaignService = CampaignService(campaignRepository, labelRepository)
    }

    @Test
    fun `getCampaignsForUser should sort on campaign name`() {
        val user = mockkClass(User::class)
        val camp1 = mockkClass(Campaign::class)
        every { camp1.name } returns "b"
        every { camp1.isAccessibleBy(any()) } returns true
        val camp2 = mockkClass(Campaign::class)
        every { camp2.name } returns "a"
        every { camp2.isAccessibleBy(any()) } returns true
        every { campaignRepository.findAll() } returns mutableListOf(camp1, camp2)
        val result = campaignService.getCampaignsForUser(user)
        Assertions.assertEquals(result, mutableListOf(camp2, camp1))
    }

    @Test
    fun `getCampaignsForUser should not return inaccessible campaigns`() {
        val user = mockkClass(User::class)
        val camp1 = mockkClass(Campaign::class)
        every { camp1.name } returns "b"
        every { camp1.isAccessibleBy(any()) } returns false
        val camp2 = mockkClass(Campaign::class)
        every { camp2.name } returns "a"
        every { camp2.isAccessibleBy(any()) } returns true
        every { campaignRepository.findAll() } returns mutableListOf(camp1, camp2)
        val result = campaignService.getCampaignsForUser(user)
        Assertions.assertEquals(result, mutableListOf(camp2))
    }

    @Test
    fun `getCampaign should return null for an inaccessible campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class)
        every { camp.isAccessibleBy(any()) } returns false
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.getCampaign(user, UUID.randomUUID())
        Assertions.assertNull(result)
    }

    @Test
    fun `getCampaign should return null for a non-existent campaign`() {
        val user = mockkClass(User::class)
        every { campaignRepository.findById(any()) } returns Optional.empty()
        val result = campaignService.getCampaign(user, UUID.randomUUID())
        Assertions.assertNull(result)
    }

    @Test
    fun `update should return false for an unowned campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class)
        every { camp.isOwnedBy(any()) } returns false
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.updateCampaign(
                user,
                UUID.randomUUID(),
                "dummy",
                CampaignSettingsDto(false, false, false)
        )
        Assertions.assertFalse(result)
    }

    @Test
    fun `update should not call save for an unowned campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class)
        every { camp.isOwnedBy(any()) } returns false
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        campaignService.updateCampaign(
                user,
                UUID.randomUUID(),
                "dummy",
                CampaignSettingsDto(false, false, false)
        )
        verify(inverse = true) { campaignRepository.save<Campaign>(any()) }
    }

    @Test
    fun `update should return true for an owned campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.isOwnedBy(any()) } returns true
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        every { campaignRepository.save<Campaign>(any()) } returns camp
        val result = campaignService.updateCampaign(
                user,
                UUID.randomUUID(),
                "dummy",
                CampaignSettingsDto(false, false, false)
        )
        Assertions.assertTrue(result)
    }

    @Test
    fun `update should call save for an owned campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.isOwnedBy(any()) } returns true
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        every { campaignRepository.save<Campaign>(any()) } returns camp
        campaignService.updateCampaign(
                user,
                UUID.randomUUID(),
                "dummy",
                CampaignSettingsDto(false, false, false)
        )
        verify { campaignRepository.save<Campaign>(any()) }
    }

    @Test
    fun `join should return false for a joined campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf(user)
        every { campaignRepository.findByInviteCode(any()) } returns Optional.of(camp)
        val result = campaignService.joinCampaign(user, UUID.randomUUID())
        Assertions.assertFalse(result)
    }

    @Test
    fun `leave should return false for a non-joined campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf()
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.leaveCampaign(user, UUID.randomUUID())
        Assertions.assertFalse(result)
    }

    @Test
    fun `leave should return false for the owner of a campaign`() {
        val user = mockkClass(User::class)
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf(user)
        every { camp.isOwnedBy(user) } returns true
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.leaveCampaign(user, UUID.randomUUID())
        Assertions.assertFalse(result)
    }

    @Test
    fun `kick should return false for a non-owned campaign`() {
        val owner = mockkClass(User::class)
        every { owner.id } returns UUID.randomUUID()
        val user = mockkClass(User::class)
        every { user.id } returns UUID.randomUUID()
        val kickableUser = mockkClass(User::class)
        val kickUuid = UUID.randomUUID()
        every { kickableUser.id } returns kickUuid
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf(user, owner, kickableUser)
        every { camp.isOwnedBy(user) } returns false
        every { camp.owner } returns owner
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.kickFromCampaign(user, UUID.randomUUID(), kickUuid)
        Assertions.assertFalse(result)
    }

    @Test
    fun `kick should return true for an owned campaign`() {
        val kickUuid = UUID.randomUUID()
        val owner = mockkClass(User::class)
        every { owner.id } returns UUID.randomUUID()
        val kickableUser = mockkClass(User::class)
        every { kickableUser.id } returns kickUuid
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf(owner, kickableUser)
        every { camp.isOwnedBy(owner) } returns true
        every { camp.owner } returns owner
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        every { campaignRepository.save<Campaign>(any()) } returns camp
        val result = campaignService.kickFromCampaign(owner, UUID.randomUUID(), kickUuid)
        Assertions.assertTrue(result)
    }

    @Test
    fun `kick should return false when kicking the owner`() {
        val kickUuid = UUID.randomUUID()
        val owner = mockkClass(User::class)
        every { owner.id } returns kickUuid
        val user = mockkClass(User::class)
        every { user.id } returns UUID.randomUUID()
        val camp = mockkClass(Campaign::class, relaxUnitFun = true)
        every { camp.members } returns mutableListOf(user, owner)
        every { camp.isOwnedBy(user) } returns true
        every { camp.owner } returns owner
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.kickFromCampaign(user, UUID.randomUUID(), kickUuid)
        Assertions.assertFalse(result)
    }

    @Test
    fun `getCharacter should not return invisible characters for non-owner`() {
        val user = mockkClass(User::class)
        val char1 = mockkClass(Character::class, relaxUnitFun = true)
        every { char1.isVisible } returns false
        val char2 = getTestCharacter(isVisible = true)
        val camp = mockkClass(Campaign::class)
        every { camp.characters } returns mutableListOf(char1, char2)
        every { camp.members } returns mutableListOf(user)
        every { camp.isOwnedBy(any()) } returns false
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.getCampaignCharacters(user, UUID.randomUUID())
        Assertions.assertEquals(result, mutableListOf(char2))
    }

    @Test
    fun `getCharacter should return invisible characters for owner`() {
        val user = mockkClass(User::class)
        val char1 = getTestCharacter(isVisible = true)
        val char2 = getTestCharacter(isVisible = true)
        val camp = mockkClass(Campaign::class)
        every { camp.characters } returns mutableListOf(char1, char2)
        every { camp.members } returns mutableListOf(user)
        every { camp.isOwnedBy(any()) } returns true
        every { campaignRepository.findById(any()) } returns Optional.of(camp)
        val result = campaignService.getCampaignCharacters(user, UUID.randomUUID())
        Assertions.assertEquals(result, mutableListOf(char1, char2))
    }
}