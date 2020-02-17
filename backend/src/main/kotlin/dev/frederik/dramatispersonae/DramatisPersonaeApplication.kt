package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@SpringBootApplication
class DramatisPersonaeApplication

fun main(args: Array<String>) {
	runApplication<DramatisPersonaeApplication>(*args)
}

@Component
@Profile("dev-light")
class LocalDevFixtures (private val campaignRepository: CampaignRepository): CommandLineRunner {

	override fun run(vararg args: String?) {
		val campaign1 = Campaign("Test camp1")
		this.campaignRepository.save(campaign1)
	}

}