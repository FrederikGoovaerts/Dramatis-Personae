package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Label(
    var name: String,
    var isVisible: Boolean,
    @ManyToOne var campaign: Campaign,
    @ManyToMany(mappedBy = "labels") var characters: MutableList<Character> = mutableListOf(),
    @Id @GeneratedValue var id: UUID? = null
)

interface LabelRepository : CrudRepository<Label, UUID>
