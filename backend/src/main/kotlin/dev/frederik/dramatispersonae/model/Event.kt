package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class Event(
    var name: String,
    @Column(columnDefinition = "TEXT") var description: String,
    @ManyToOne var campaign: Campaign,
    @ManyToMany @JoinTable(name="event_character", inverseJoinColumns=[JoinColumn(name="character_id")]) var characters: MutableList<Character> = mutableListOf(),
    @ManyToMany @JoinTable(name="event_location", inverseJoinColumns=[JoinColumn(name="location_id")]) var locations: MutableList<Location> = mutableListOf(),
    var addedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface EventRepository : CrudRepository<Event, UUID>
