package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.UserRepository
import org.springframework.web.bind.annotation.*

data class UserView(val name: String, val email: String)

@RestController
@RequestMapping("/api/user")
class UserController(val userRepository: UserRepository) {

    @GetMapping
    fun getSelf(auth: GoogleAuthentication) = UserView(auth.principal.fullName, auth.principal.email)
}
