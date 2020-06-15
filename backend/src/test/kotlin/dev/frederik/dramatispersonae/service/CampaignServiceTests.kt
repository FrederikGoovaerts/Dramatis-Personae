package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.fixtures.getTestCampaign
import dev.frederik.dramatispersonae.fixtures.getTestUser
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
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