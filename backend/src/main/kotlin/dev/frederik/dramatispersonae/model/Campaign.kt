package dev.frederik.dramatispersonae.model

import dev.frederik.dramatispersonae.model.note.CampaignNote
import org.springframework.data.repository.CrudRepository
import java.util.*
import javax.persistence.*

@Entity
data class Campaign(
    var name: String,
    @ManyToOne var owner: User,
    @ManyToMany var members: MutableList<User>,
    @OneToMany(
        mappedBy = "campaign",
        cascade = [CascadeType.ALL]
    ) var characters: MutableList<Character> = mutableListOf(),
    @OneToMany(
        mappedBy = "campaign",
        cascade = [CascadeType.ALL]
    ) var locations: MutableList<Location> = mutableListOf(),
    @OneToMany(mappedBy = "campaign", cascade = [CascadeType.ALL]) var events: MutableList<Event> = mutableListOf(),
    @OneToMany(
        mappedBy = "campaign",
        cascade = [CascadeType.ALL]
    ) var notes: MutableList<CampaignNote> = mutableListOf(),
    @OneToMany(mappedBy = "campaign", cascade = [CascadeType.ALL]) var labels: MutableList<Label> = mutableListOf(),
    var inviteCode: UUID = UUID.randomUUID(),
    @Id @GeneratedValue var id: UUID? = null
) {
    fun isAccessibleBy(user: User) = members.contains(user)
    fun isOwnedBy(user: User) = owner == user
}

interface CampaignRepository : CrudRepository<Campaign, UUID> {
    fun findByInviteCode(code: UUID): Optional<Campaign>
}
