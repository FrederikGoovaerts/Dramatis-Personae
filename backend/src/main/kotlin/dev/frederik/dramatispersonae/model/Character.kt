package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity(name = "_character")
data class Character(
    var name: String,
    var description: String,
    var isVisible: Boolean,
    @ManyToOne var campaign: Campaign,
    @OneToMany(mappedBy = "character", cascade = [CascadeType.ALL]) var notes: MutableList<Note> = mutableListOf(),
    var addedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface CharacterRepository : CrudRepository<Character, UUID>
