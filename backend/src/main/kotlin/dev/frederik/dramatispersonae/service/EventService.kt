package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*
import java.util.*
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
    ): ResponseEntity<List<EventView>?> {
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

    @PutMapping("/{id}/ordinal")
    fun updateOrdinal(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody ord: Int
    ): ResponseEntity<Unit> {
        service.moveEvent(auth.principal, id, ord)
        return ResponseEntity(HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteEvent(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteEvent(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class EventService(
    private val repository: EventRepository,
    private val campaignRepository: CampaignRepository,
    private val characterRepository: CharacterRepository
) {

    private val listWriteMutexMap = mutableMapOf<UUID, ReentrantLock>()

    @Synchronized
    private fun getLock(campaignId: UUID): ReentrantLock {
        if (!listWriteMutexMap.containsKey(campaignId)) {
            listWriteMutexMap[campaignId] = ReentrantLock()
        }
        return listWriteMutexMap[campaignId]!!
    }

    fun createEvent(user: User, campaignId: UUID, name: String, description: String): Boolean {
        val lock = getLock(campaignId)
        val campaignQuery = campaignRepository.findById(campaignId)
        if (!campaignQuery.isPresent || !campaignQuery.get().isAccessibleBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        lock.lock()
        val nextOrdinal = repository.findTopByCampaignOrderByOrdinalDesc(campaign).map { it.ordinal + 1 }.orElse(0)
        val event = Event(name, nextOrdinal, description, campaign)
        repository.save(event)
        campaign.events.add(event)
        campaignRepository.save(campaign)
        lock.unlock()
        return true
    }

    fun updateEvent(user: User, eventId: UUID, name: String, description: String): Boolean {
        val eventQuery = repository.findById(eventId)
        if (!eventQuery.isPresent || !eventQuery.get().campaign.isAccessibleBy(user)) {
            return false
        }
        val event = eventQuery.get()
        event.name = name
        event.description = description
        repository.save(event)
        return true
    }

    fun moveEvent(user: User, eventId: UUID, newPos: Int): Boolean {
        val eventQuery = repository.findById(eventId)
        if (!eventQuery.isPresent || !eventQuery.get().campaign.isAccessibleBy(user)) {
            return false
        }
        val event = eventQuery.get()
        val oldPos = event.ordinal
        val events = repository.findAllByCampaignOrderByOrdinalAsc(event.campaign)
        for (e in events) {
            if (e.id === eventId) {
                e.ordinal = newPos
            } else if (e.ordinal in oldPos.coerceAtMost(newPos)..oldPos.coerceAtLeast(newPos)) {
                if (newPos > oldPos) {
                    e.ordinal--
                } else {
                    e.ordinal++
                }
            }
        }
        repository.saveAll(events)
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
        return repository.findAllByCampaignOrderByOrdinalDesc(campaign)
    }
}
