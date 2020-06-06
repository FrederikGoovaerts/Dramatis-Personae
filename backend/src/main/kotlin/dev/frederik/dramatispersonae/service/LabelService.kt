package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.data.repository.CrudRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/label")
class LabelController(private val service: LabelService) {

    @PutMapping("/{id}")
    fun updateLabel(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody label: CreateLabelDto
    ): ResponseEntity<Unit> {
        val success = this.service.updateLabel(auth.principal, id, label.name, label.visible)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteLabel(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteLabel(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }
}

@Component
class LabelService(private val repository: LabelRepository) {

    fun updateLabel(user: User, id: UUID, name: String, visible: Boolean): Boolean {
        val labelQuery = repository.findById(id)
        if (!labelQuery.isPresent) {
            return false
        }
        val label = labelQuery.get()
        if (!label.campaign.isOwnedBy(user)) {
            return false
        }
        label.name = name
        label.isVisible = visible
        this.repository.save(label)
        return true
    }

    fun deleteLabel(user: User, id: UUID): Boolean {
        val labelQuery = repository.findById(id)
        if (!labelQuery.isPresent || !labelQuery.get().campaign.isOwnedBy(user)) {
            return false
        }
        repository.delete(labelQuery.get())
        return true
    }
}
