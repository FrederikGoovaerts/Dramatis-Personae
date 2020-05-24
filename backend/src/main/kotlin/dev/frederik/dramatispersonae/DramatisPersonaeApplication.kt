package dev.frederik.dramatispersonae

import dev.frederik.dramatispersonae.model.*
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
class LocalDevFixtures(
    private val userRepository: UserRepository,
    private val campaignRepository: CampaignRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        val user1 = User("1", "Jack Name1", "Email1")
        val user2 = User("2", "Joe Name2", "Email2")
        this.userRepository.save(user1)
        this.userRepository.save(user2)
        val campaign1 = Campaign("Camp short", user1, mutableListOf(user1, user2))
        val campaign2 = Campaign("Camp2", user2, mutableListOf(user2))
        val campaign3 = Campaign("A campaign with a rather long name", user2, mutableListOf(user1, user2))
        val campaign4 = Campaign("An auto-propose-accepting campaign", user2, mutableListOf(user1, user2))
        campaign4.autoAcceptProposedCharacter = true
        val char1 = Character("Char1", "A visible char in an owned campaign", true, campaign1, mutableListOf())
        val char2 = Character("Char2", "An invisible char in an owned campaign", false, campaign1, mutableListOf())
        val char3 = Character("Char3", "A visible char in a non-owned campaign", true, campaign3, mutableListOf())
        val char4 = Character("Char4", "An invisible char in a non-owned campaign", false, campaign3, mutableListOf())
        val note1 = Note("Test note", user1, char1, NoteVisibility.PRIVATE)
        val note2 = Note("Another note, but one with a lot more text. This note allows us to test the wrapping and te" +
                "xt rendering behaviour of a longer note. Actually you know what I'm adding a longer one with some lo" +
                "rem ipsum.", user1, char1, NoteVisibility.DM_SHARED)
        val note3 = Note("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ipsum libero, dictum at faci" +
                "lisis sit amet, posuere non eros. Proin dignissim finibus massa, eget mattis risus. Pellentesque hab" +
                "itant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec non nisi nibh. N" +
                "ulla eu augue et enim auctor auctor vel in lorem. Aliquam dignissim malesuada finibus. Sed lobortis " +
                "ante felis, id porttitor ligula vestibulum ut. Donec rhoncus luctus congue. Nunc commodo sollicitudi" +
                "n est eget varius. Mauris aliquet arcu dolor, at suscipit nulla rhoncus non. Nunc suscipit imperdiet" +
                " dui elementum finibus. Aliquam eget vehicula leo, non ultricies nisl. Interdum et malesuada fames a" +
                "c ante ipsum primis in faucibus. Duis consequat diam odio, a cursus libero lobortis a. Proin ultrici" +
                "es et lorem non ultrices. ", user1, char1, NoteVisibility.PUBLIC)
        val note4 = Note("Test note private of user 2", user2, char1, NoteVisibility.PRIVATE)
        val note5 = Note("Test note dm-shared of user 2", user2, char1, NoteVisibility.DM_SHARED)
        val note6 = Note("Test note public of user 2", user2, char1, NoteVisibility.PUBLIC)
        char1.notes.add(note1)
        char1.notes.add(note2)
        char1.notes.add(note3)
        char1.notes.add(note4)
        char1.notes.add(note5)
        char1.notes.add(note6)
        campaign1.characters.add(char1)
        campaign1.characters.add(char2)
        campaign3.characters.add(char3)
        campaign3.characters.add(char4)
        this.campaignRepository.save(campaign1)
        this.campaignRepository.save(campaign2)
        this.campaignRepository.save(campaign3)
        this.campaignRepository.save(campaign4)
    }
}
