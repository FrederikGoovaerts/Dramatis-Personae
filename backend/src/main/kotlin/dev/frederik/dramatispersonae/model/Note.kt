package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Note(var contents: String,
                @OneToOne var author: User,
                @ManyToOne var character: Character,
                @Id @GeneratedValue var id: UUID? = null)

interface NoteRepository: CrudRepository<Note, UUID>
