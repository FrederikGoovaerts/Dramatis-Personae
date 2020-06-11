package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class Label(
    var name: String,
    var isVisible: Boolean,
    @ManyToOne var campaign: Campaign,
    @ManyToMany(mappedBy = "labels") var characters: MutableList<Character> = mutableListOf(),
    @Id @GeneratedValue var id: UUID? = null
)

interface LabelRepository : CrudRepository<Label, UUID>
