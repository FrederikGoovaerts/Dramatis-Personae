package dev.frederik.dramatispersonae.model

import java.util.*

enum class NoteVisibility {
    PRIVATE, DM_SHARED, PUBLIC
}

interface Note {
    var contents: String
    var author: User
    var visibility: NoteVisibility
    var addedOn: Date
    var editedOn: Date
    var id: UUID?
}
