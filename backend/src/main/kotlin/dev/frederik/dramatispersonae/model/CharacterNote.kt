package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class CharacterNote(
    @Column(name = "contents", columnDefinition = "TEXT") var contents: String,
    @OneToOne var author: User,
    @ManyToOne var character: Character,
    @Enumerated(EnumType.STRING) var visibility: NoteVisibility,
    var addedOn: Date = Date(),
    var editedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface CharacterNoteRepository : CrudRepository<CharacterNote, UUID>
