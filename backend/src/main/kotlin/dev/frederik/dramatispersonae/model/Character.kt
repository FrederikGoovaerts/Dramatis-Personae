package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

@Entity
class Character(var name: String,
                var description: String,
                var isVisible: Boolean,
                @Id @GeneratedValue var id: Long? = null)

interface CharacterRepository: CrudRepository<Character, Long>