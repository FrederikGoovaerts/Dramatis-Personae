package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.model.note.CharacterNote
import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity(name = "_character")
data class Character(
    var name: String,
    var description: String,
    var isVisible: Boolean,
    @ManyToOne var campaign: Campaign,
    @OneToMany(mappedBy = "character", cascade = [CascadeType.ALL]) var notes: MutableList<CharacterNote> = mutableListOf(),
    @ManyToMany
    @JoinTable(name = "character_label", joinColumns = [JoinColumn(name = "character_id")], inverseJoinColumns = [JoinColumn(name = "label_id")])
    var labels: MutableList<Label> = mutableListOf(),
    var addedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface CharacterRepository : CrudRepository<Character, UUID>
