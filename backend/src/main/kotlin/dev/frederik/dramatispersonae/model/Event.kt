package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Event(
    var name: String,
    var ordinal: Int,
    @Column(columnDefinition = "TEXT") var description: String,
    @ManyToOne var campaign: Campaign,
    @ManyToMany @JoinTable(
        name = "event_character",
        inverseJoinColumns = [JoinColumn(name = "character_id")]
    ) var characters: MutableList<Character> = mutableListOf(),
    @ManyToMany @JoinTable(
        name = "event_location",
        inverseJoinColumns = [JoinColumn(name = "location_id")]
    ) var locations: MutableList<Location> = mutableListOf(),
    @Id @GeneratedValue var id: UUID? = null
)

interface EventRepository : CrudRepository<Event, UUID> {
    fun findAllByCampaignOrderByOrdinalAsc(campaign: Campaign): List<Event>
    fun findAllByCampaignOrderByOrdinalDesc(campaign: Campaign): List<Event>
    fun findTopByCampaignOrderByOrdinalDesc(campaign: Campaign): Optional<Event>
}
