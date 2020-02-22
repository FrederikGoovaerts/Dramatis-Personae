package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.model.Campaign
import dev.frederik.dramatispersonae.model.CampaignRepository
import dev.frederik.dramatispersonae.model.Character
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
		val user2 = User("2", "Name2", "Email2")
		this.userRepository.save(user1)
		this.userRepository.save(user2)
		val campaign1 = Campaign("Camp1", user1, mutableListOf(user1, user2), mutableListOf())
		val campaign2 = Campaign("Camp2", user2, mutableListOf(user2), mutableListOf())
		val campaign3 = Campaign("Camp3", user2, mutableListOf(user1, user2), mutableListOf())
		val char1 = Character("Char1", "A visible char in an owned campaign", true, campaign1, mutableListOf())
		val char2 = Character("Char2", "An invisible char in an owned campaign", false, campaign1, mutableListOf())
		val char3 = Character("Char3", "A visible char in a non-owned campaign", true, campaign3, mutableListOf())
		val char4 = Character("Char4", "An invisible char in a non-owned campaign", false, campaign3, mutableListOf())
		campaign1.characters.add(char1)
		campaign1.characters.add(char2)
		campaign3.characters.add(char3)
		campaign3.characters.add(char4)
		this.campaignRepository.save(campaign1)
		this.campaignRepository.save(campaign2)
		this.campaignRepository.save(campaign3)
	}

}