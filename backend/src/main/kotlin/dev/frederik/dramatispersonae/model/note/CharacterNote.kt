package dev.frederik.dramatispersonae.model.note

import dev.frederik.dramatispersonae.model.Character
import dev.frederik.dramatispersonae.model.User
import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class CharacterNote(
    @Column(name = "contents", columnDefinition = "TEXT") override var contents: String,
    @OneToOne override var author: User,
    @ManyToOne var character: Character,
    @Enumerated(EnumType.STRING) override var visibility: NoteVisibility,
    override var editedOn: Date = Date(),
    @Id @GeneratedValue override var id: UUID? = null
) : Note

interface CharacterNoteRepository : CrudRepository<CharacterNote, UUID>
