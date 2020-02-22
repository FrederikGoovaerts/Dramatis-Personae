package dev.frederik.dramatispersonae.service

import java.util.*

data class CreateCharacterDto(val name: String, val description: String)

data class CharacterListView(val name: String, val id: UUID)
