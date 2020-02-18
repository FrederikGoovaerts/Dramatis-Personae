package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import javax.persistence.*

@Entity
data class Character(var name: String,
                     var description: String,
                     var isVisible: Boolean,
                     @ManyToOne var campaign: Campaign,
                     @OneToMany(mappedBy = "character", cascade = [CascadeType.REMOVE]) var notes: List<Note>,
                     @Id @GeneratedValue var id: Long? = null)

interface CharacterRepository: CrudRepository<Character, Long>