package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.ManyToOne

@Entity
data class Note(var contents: String,
                var author: User,
                @ManyToOne var character: Character,
                @Id @GeneratedValue var id: Long? = null)

interface NoteRepository: CrudRepository<Note, Long>
