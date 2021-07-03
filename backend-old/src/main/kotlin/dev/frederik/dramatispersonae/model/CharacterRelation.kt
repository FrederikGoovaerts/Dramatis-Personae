package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class CharacterRelation(
    @Column(name = "relation", columnDefinition = "TEXT") var relation: String,
    @ManyToOne var origin: Character,
    @ManyToOne var destination: Character,
    @Id @GeneratedValue var id: UUID? = null
)

interface CharacterRelationRepository : CrudRepository<CharacterRelation, UUID> {
    fun findByOrigin(origin: Character): List<CharacterRelation>
    fun findByDestination(origin: Character): List<CharacterRelation>
}
