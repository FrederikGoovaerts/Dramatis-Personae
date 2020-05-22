package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import org.springframework.data.repository.CrudRepository

@Entity(name = "_user")
data class User(
    var googleId: String,
    var fullName: String,
    var email: String,
    @Id @GeneratedValue var id: UUID? = null
)

interface UserRepository : CrudRepository<User, UUID> {
    fun findByGoogleId(googleId: String): User?
}
