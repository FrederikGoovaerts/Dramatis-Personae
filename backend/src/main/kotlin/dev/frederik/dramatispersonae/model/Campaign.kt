package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class Campaign(
    var name: String,
    @ManyToOne var owner: User,
    @ManyToMany var members: MutableList<User>,
    @OneToMany(mappedBy = "campaign", cascade = [CascadeType.ALL]) var characters: MutableList<Character>,
    var inviteCode: UUID = UUID.randomUUID(),
    @Id @GeneratedValue var id: UUID? = null
) {
    fun isAccessibleBy(user: User) = members.contains(user)
    fun isOwnedBy(user: User) = owner == user
}

interface CampaignRepository : CrudRepository<Campaign, UUID> {
    fun findByInviteCode(code: UUID): Optional<Campaign>
}
