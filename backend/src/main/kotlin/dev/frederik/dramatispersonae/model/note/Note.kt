package dev.frederik.dramatispersonae.model.note

import dev.frederik.dramatispersonae.model.User
import java.util.*

enum class NoteVisibility {
    PRIVATE, DM_SHARED, PUBLIC
}

interface Note {
    var contents: String
    var author: User
    var visibility: NoteVisibility
    var editedOn: Date
    var id: UUID?
}
