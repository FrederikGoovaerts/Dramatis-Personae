package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull


@Entity
data class User(var googleId: String,
                var fullName: String,
                var email: String,
                @Id @GeneratedValue var id: Long? = null)

interface UserRepository: CrudRepository<User, Long> {
    fun findByGoogleId(googleId: String): User?
}
