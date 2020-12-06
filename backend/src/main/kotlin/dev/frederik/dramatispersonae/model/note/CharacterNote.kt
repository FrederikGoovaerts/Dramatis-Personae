package dev.frederik.dramatispersonae.model.note

import dev.frederik.dramatispersonae.model.Character
import dev.frederik.dramatispersonae.model.User
import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class CharacterNote(
    @Column(name = "contents", columnDefinition = "TEXT") override var contents: String,
    @OneToOne override var author: User,
    @ManyToOne var character: Character,
    @Enumerated(EnumType.STRING) override var visibility: NoteVisibility,
    var addedOn: Date = Date(),
    override var editedOn: Date = Date(),
    @Id @GeneratedValue override var id: UUID? = null
) : Note

interface CharacterNoteRepository : CrudRepository<CharacterNote, UUID>
