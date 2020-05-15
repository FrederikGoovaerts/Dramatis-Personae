package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Note(@Column(name="contents", columnDefinition = "TEXT") var contents: String,
                @OneToOne var author: User,
                @ManyToOne var character: Character,
                @Column(name="added_on", columnDefinition = "TIMESTAMP WITH TIME ZONE") var addedOn: Date = Date(),
                @Column(name="edited_on", columnDefinition = "TIMESTAMP WITH TIME ZONE") var editedOn: Date = Date(),
                @Id @GeneratedValue var id: UUID? = null)

interface NoteRepository: CrudRepository<Note, UUID>
