package dev.frederik.dramatispersonae.service

import java.util.*

data class CreateNoteDto(val contents: String)

data class NoteView(val contents: String, val id: UUID)
