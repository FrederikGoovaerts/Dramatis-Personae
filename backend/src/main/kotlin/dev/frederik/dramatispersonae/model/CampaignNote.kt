package dev.frederik.dramatispersonae.model

import java.util.*
import javax.persistence.*
import org.springframework.data.repository.CrudRepository

@Entity
data class CampaignNote(
    @Column(name = "contents", columnDefinition = "TEXT") override var contents: String,
    @OneToOne override var author: User,
    @ManyToOne var campaign: Campaign,
    @Enumerated(EnumType.STRING) override var visibility: NoteVisibility,
    override var addedOn: Date = Date(),
    override var editedOn: Date = Date(),
    @Id @GeneratedValue override var id: UUID? = null
) : Note

interface CampaignNoteRepository : CrudRepository<CampaignNote, UUID>
