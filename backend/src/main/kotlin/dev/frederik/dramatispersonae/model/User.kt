package dev.frederik.dramatispersonae.model

import org.springframework.data.repository.CrudRepository
import org.springframework.security.authentication.AbstractAuthenticationToken
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull


@Entity
class User(@NotNull var googleId: String,
           @NotEmpty var fullName: String,
           @NotEmpty var email: String,
           @Id @GeneratedValue var id: Long? = null)

interface UserRepository: CrudRepository<User, Long> {
    fun findByGoogleId(googleId: String): User?
}
