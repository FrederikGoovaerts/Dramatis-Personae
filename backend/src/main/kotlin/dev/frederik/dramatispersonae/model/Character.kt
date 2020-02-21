package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Character(var name: String,
                     var description: String,
                     var isVisible: Boolean,
                     @ManyToOne var campaign: Campaign,
                     @OneToMany(mappedBy = "character", cascade = [CascadeType.REMOVE]) var notes: MutableList<Note>,
                     @Id @GeneratedValue var id: UUID? = null)

interface CharacterRepository: CrudRepository<Character, UUID>