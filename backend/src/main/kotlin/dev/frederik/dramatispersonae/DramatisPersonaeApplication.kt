package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.User
import dev.frederik.dramatispersonae.model.UserRepository
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

/**
 * Initializer for dev mode fixtures in in-memory database.
 */
@Component
@Profile("dev")
class LocalDevFixtures (private val userRepository: UserRepository,
						private val campaignRepository: CampaignRepository): CommandLineRunner {

	override fun run(vararg args: String?) {
		val user1 = User("1", "Name1", "Email1")
		this.userRepository.save(user1)
		val user2 = User("2", "Name2", "Email2")
		this.userRepository.save(user2)
		val campaign1 = Campaign("Camp1", user1, mutableListOf(user1, user2), mutableListOf())
		this.campaignRepository.save(campaign1)
		val campaign2 = Campaign("Camp2", user2, mutableListOf(user2), mutableListOf())
		this.campaignRepository.save(campaign2)
	}

}