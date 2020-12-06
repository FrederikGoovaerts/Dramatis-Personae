package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.model.note.LocationNote
import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class Location(
    var name: String,
    var description: String,
    var isVisible: Boolean,
    @ManyToOne var campaign: Campaign,
    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL]) var notes: MutableList<LocationNote> = mutableListOf(),
    @ManyToMany
    @JoinTable(name = "location_label", joinColumns = [JoinColumn(name = "location_id")], inverseJoinColumns = [JoinColumn(name = "label_id")])
    var labels: MutableList<Label> = mutableListOf(),
    @ManyToMany @JoinTable(name="event_location", inverseJoinColumns=[JoinColumn(name="event_id")])
    var events: MutableList<Event> = mutableListOf(),
    var addedOn: Date = Date(),
    @Id @GeneratedValue var id: UUID? = null
)

interface LocationRepository : CrudRepository<Location, UUID>
