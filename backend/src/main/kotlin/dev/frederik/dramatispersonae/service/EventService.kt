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
    val title: String,
    val description: String,
    val ordinal: Int,
    val id: UUID
)

@RestController
@RequestMapping("/api/event")
class EventController(private val service: EventService) {

    @PostMapping("/")
    fun createEvent(
        auth: GoogleAuthentication,
        @RequestBody dto: CreateEventDto
    ): ResponseEntity<Unit> {
        service.createEvent(auth.principal, dto.campaignId, dto.name, dto.description)
        return ResponseEntity(HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteEvent(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteEvent(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class EventService(private val repository: EventRepository, private val campaignRepository: CampaignRepository) {

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

    fun deleteEvent(user: User, id: UUID): Boolean {
        val eventQuery = repository.findById(id)
        if (!eventQuery.isPresent || !eventQuery.get().campaign.isAccessibleBy(user)) {
            return false
        }
        repository.delete(eventQuery.get())
        return true
    }
}
