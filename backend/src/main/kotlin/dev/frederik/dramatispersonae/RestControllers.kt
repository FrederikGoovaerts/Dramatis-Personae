package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.CreateCampaignDto
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/campaign")
class ArticleController(private val repository: CampaignRepository) {

    @GetMapping("/")
    fun getCampaigns() = repository.findAll()

    @PostMapping("/")
    fun postCampaign(@RequestBody campaign: CreateCampaignDto) {
        val newCampaign = Campaign(campaign.name)
        this.repository.save(newCampaign)
    }

}