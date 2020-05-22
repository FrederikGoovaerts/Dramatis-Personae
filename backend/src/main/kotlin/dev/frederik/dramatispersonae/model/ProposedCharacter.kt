package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity(name = "proposedCharacter")
data class ProposedCharacter(
    var name: String,
    var description: String,
    @ManyToOne var campaign: Campaign,
    @ManyToOne var proposedBy: User,
    var proposedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface ProposedCharacterRepository : CrudRepository<ProposedCharacter, UUID>
