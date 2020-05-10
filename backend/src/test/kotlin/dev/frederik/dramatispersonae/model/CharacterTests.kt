package dev.frederik.dramatispersonae.model

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager

@DataJpaTest
class CharacterRepositoryTests @Autowired constructor(val entityManager: TestEntityManager,
                                                      val userRepository: CharacterRepository) {

    @BeforeEach
    fun beforeEach() {
        val dummyChar = Character("dummy name", "a character", true)
        userRepository.save(dummyChar)
    }

    @Test
    fun `Should persist a character`() {
        val amount = userRepository.findAll().count()
        assertThat(amount).isEqualTo(1);
    }

}
