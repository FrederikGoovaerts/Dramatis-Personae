package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id

class CreateCampaignDto(var name: String)

@Entity
class Campaign(var name: String,
               var inviteCode: UUID = UUID.randomUUID(),
               @Id @GeneratedValue var id: Long? = null)

interface CampaignRepository: CrudRepository<Campaign, Long>