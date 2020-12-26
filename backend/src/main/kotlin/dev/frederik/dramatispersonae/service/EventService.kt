package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.concurrent.locks.ReentrantLock

data class CreateEventDto(val campaignId: UUID, val name: String, val description: String)
data class UpdateEventDto(val name: String, val description: String)

data class EventView(
    val name: String,
    val description: String,
    val ordinal: Int,
    val id: UUID
)

@RestController
@RequestMapping("/api/event")
class EventController(private val service: EventService) {

    @GetMapping("/{id}")
    fun getEvents(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<EventView>> {
        val result = service.getEvents(auth.principal, id)

        return ResponseEntity(result?.map {
            EventView(it.name, it.description, it.ordinal, it.id!!)
        }, if (result == null) HttpStatus.FORBIDDEN else HttpStatus.OK)
    }

    @PostMapping("/")
    fun createEvent(
        auth: GoogleAuthentication,
        @RequestBody dto: CreateEventDto
    ): ResponseEntity<Unit> {
        service.createEvent(auth.principal, dto.campaignId, dto.name, dto.description)
        return ResponseEntity(HttpStatus.OK)
    }

    @PutMapping("/{id}")
    fun updateEvent(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: UpdateEventDto
    ): ResponseEntity<Unit> {
        service.updateEvent(auth.principal, id, dto.name, dto.description)
        return ResponseEntity(HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteEvent(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteEvent(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class EventService(private val repository: EventRepository,
                   private val campaignRepository: CampaignRepository,
                   private val characterRepository: CharacterRepository) {

    // TODO: Currently different campaigns impact one another with this
    private val eventListWriteMutex = ReentrantLock()

    fun createEvent(user: User, campaignId: UUID, name: String, description: String): Boolean {
        val campaignQuery = campaignRepository.findById(campaignId)
        if (!campaignQuery.isPresent || !campaignQuery.get().isAccessibleBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        eventListWriteMutex.lock()
        val nextOrdinal = repository.findTopByCampaignOrderByOrdinalDesc(campaign).map { it.ordinal + 1 }.orElse(0)
        val event = Event(name, nextOrdinal, description, campaign)
        repository.save(event)
        campaign.events.add(event)
        campaignRepository.save(campaign)
        eventListWriteMutex.unlock()
        return true
    }

    fun updateEvent(user: User, id: UUID, name: String, description: String): Boolean {
        val eventQuery = repository.findById(id)
        if (!eventQuery.isPresent || !eventQuery.get().campaign.isAccessibleBy(user)) {
            return false
        }
        eventListWriteMutex.lock()
        val event = eventQuery.get()
        event.name = name
        event.description = description
        repository.save(event)
        eventListWriteMutex.unlock()
        return true
    }

    fun deleteEvent(user: User, id: UUID): Boolean {
        val eventQuery = repository.findById(id)
        if (!eventQuery.isPresent || !eventQuery.get().campaign.isAccessibleBy(user)) {
            return false
        }
        repository.delete(eventQuery.get())
        return true
    }

    fun getEvents(user: User, campaignId: UUID): List<Event>? {
        val campaignQuery = campaignRepository.findById(campaignId)
        if (!campaignQuery.isPresent || !campaignQuery.get().isAccessibleBy(user)) {
            return null
        }
        val campaign = campaignQuery.get()
        return repository.findAllByCampaignOrderByOrdinalAsc(campaign)
    }
}
