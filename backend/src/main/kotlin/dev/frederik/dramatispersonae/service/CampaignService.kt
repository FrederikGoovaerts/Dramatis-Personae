package dev.frederik.dramatispersonae.service

import dev.frederik.dramatispersonae.auth.GoogleAuthentication
import dev.frederik.dramatispersonae.model.*
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.*

data class CampaignSettingsDto(
    val autoAcceptProposedCharacter: Boolean,
    val allowPlayerLabelManagement: Boolean,
    val allowPlayerCharacterLabelManagement: Boolean
)

data class CreateCampaignDto(val name: String)
data class UpdateCampaignDto(val name: String, val campaignSettings: CampaignSettingsDto)
data class CreateLabelDto(val name: String, val visible: Boolean)

data class CampaignView(
    val name: String,
    val id: UUID,
    val owner: Boolean,
    val ownerName: String,
    val settings: CampaignSettingsDto,
    val inviteCode: UUID?
)
data class CampaignMemberView(val name: String, val id: UUID, val owner: Boolean)

@RestController
@RequestMapping("/api/campaign")
class CampaignController(private val service: CampaignService) {

    @GetMapping
    fun getCampaigns(auth: GoogleAuthentication) =
            service.getCampaignsForUser(auth.principal).map {
                CampaignView(
                    it.name,
                    it.id!!,
                    it.isOwnedBy(auth.principal),
                    it.owner.fullName,
                    CampaignSettingsDto(
                        it.autoAcceptProposedCharacter,
                        it.allowPlayerLabelManagement,
                        it.allowPlayerCharacterLabelManagement
                    ),
                    if (it.isOwnedBy(auth.principal)) it.inviteCode else null
                )
            }

    @GetMapping("/{id}")
    fun getCampaign(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<CampaignView> {
        val campaign = this.service.getCampaign(auth.principal, id)
        return if (campaign === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(CampaignView(
                campaign.name,
                campaign.id!!,
                campaign.isOwnedBy(auth.principal),
                campaign.owner.fullName,
                CampaignSettingsDto(
                    campaign.autoAcceptProposedCharacter,
                    campaign.allowPlayerLabelManagement,
                    campaign.allowPlayerCharacterLabelManagement
                ),
                if (campaign.isOwnedBy(auth.principal)) campaign.inviteCode else null
            ), HttpStatus.OK)
        }
    }

    @PostMapping
    fun postCampaign(auth: GoogleAuthentication, @RequestBody campaign: CreateCampaignDto): ResponseEntity<Unit> {
        this.service.createCampaign(auth.principal, campaign.name)
        return ResponseEntity(HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateCampaign(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody campaign: UpdateCampaignDto
    ): ResponseEntity<Unit> {
        val success = this.service.updateCampaign(auth.principal, id, campaign.name, campaign.campaignSettings)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @DeleteMapping("/{id}")
    fun deleteCampaign(auth: GoogleAuthentication, @PathVariable id: UUID): ResponseEntity<Unit> {
        val success = this.service.deleteCampaign(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/character")
    fun getCampaignCharacterList(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<CharacterListView>> {
        val list = this.service.getCampaignCharacters(auth.principal, id)
        return if (list === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(list.map { CharacterListView(it.name, it.description, it.labels.map { l -> LabelListView(l.name, l.isVisible) }, it.isVisible, it.id!!) }, HttpStatus.OK)
        }
    }

    @PostMapping("/{id}/character")
    fun createCampaignCharacter(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateCharacterDto
    ): ResponseEntity<Unit> {
        val success = this.service.createCharacter(auth.principal, id, dto.name, dto.description)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/proposedcharacter")
    fun getProposedCharacters(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<ProposedCharacterView>> {
        val list = this.service.getProposedCharacters(auth.principal, id)
        return if (list === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(list.map { ProposedCharacterView(
                    it.name,
                    it.description,
                    it.proposedOn,
                    it.proposedBy.fullName,
                    it.id!!
            ) }, HttpStatus.OK)
        }
    }

    @PostMapping("/{id}/proposedcharacter")
    fun proposeCharacter(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateCharacterDto
    ): ResponseEntity<Unit> {
        val success = this.service.proposeCharacter(auth.principal, id, dto.name, dto.description)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/members")
    fun getCampaignMembers(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<CampaignMemberView>> {
        val map = this.service.getCampaignMembers(auth.principal, id)
        return if (map === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(map
                    .map { CampaignMemberView(it.key.fullName, it.key.id!!, it.value) }
                    .toList(), HttpStatus.OK)
        }
    }

    @PostMapping("/{campaignId}/kick/{userId}")
    fun kickFromCampaign(
        auth: GoogleAuthentication,
        @PathVariable campaignId: UUID,
        @PathVariable userId: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.kickFromCampaign(auth.principal, campaignId, userId)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/leave/{id}")
    fun leaveCampaign(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.leaveCampaign(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/join/{code}")
    fun joinCampaign(
        auth: GoogleAuthentication,
        @PathVariable code: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.joinCampaign(auth.principal, code)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/{id}/rotatecode")
    fun rotateInviteCode(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<Unit> {
        val success = this.service.rotateInviteCode(auth.principal, id)
        return ResponseEntity(if (success) HttpStatus.OK else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/note")
    fun getNoteList(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

    @GetMapping("/{id}/sharednotes")
    fun getSharedNotes(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<NoteView>> {
        val list = this.service.getSharedNotes(auth.principal, id)
        return returnNotes(list, auth.principal)
    }

    @PostMapping("/{id}/note")
    fun createNote(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateNoteDto
    ): ResponseEntity<Unit> {
        val success = this.service.createNote(auth.principal, id, dto.contents, dto.visibility)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @PostMapping("/{id}/label")
    fun createLabel(
        auth: GoogleAuthentication,
        @PathVariable id: UUID,
        @RequestBody dto: CreateLabelDto
    ): ResponseEntity<Unit> {
        val success = this.service.createLabel(auth.principal, id, dto.name, dto.visible)
        return ResponseEntity(if (success) HttpStatus.CREATED else HttpStatus.FORBIDDEN)
    }

    @GetMapping("/{id}/label")
    fun getLabels(
        auth: GoogleAuthentication,
        @PathVariable id: UUID
    ): ResponseEntity<List<LabelView>> {
        val list = this.service.getLabels(auth.principal, id)
        return if (list === null) {
            ResponseEntity(HttpStatus.FORBIDDEN)
        } else {
            ResponseEntity(list
                .map { LabelView(it.name, it.id!!, it.isVisible) }
                .toList(), HttpStatus.OK)
        }
    }
}

@Component
class CampaignService(private val repository: CampaignRepository, private val labelRepository: LabelRepository) {

    fun getCampaignsForUser(user: User): List<Campaign> = repository.findAll().filter { it.isAccessibleBy(user) }

    fun getCampaign(user: User, id: UUID): Campaign? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isAccessibleBy(user)) {
            return null
        }
        return campaignQuery.orElse(null)
    }

    fun createCampaign(user: User, name: String): Campaign {
        val newCampaign = Campaign(name, user, mutableListOf(user), mutableListOf(), mutableListOf())
        return this.repository.save(newCampaign)
    }

    fun updateCampaign(user: User, id: UUID, name: String, campaignSettings: CampaignSettingsDto): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.name = name
        campaign.autoAcceptProposedCharacter = campaignSettings.autoAcceptProposedCharacter
        campaign.allowPlayerLabelManagement = campaignSettings.allowPlayerLabelManagement
        campaign.allowPlayerCharacterLabelManagement = campaignSettings.allowPlayerCharacterLabelManagement
        this.repository.save(campaign)
        return true
    }

    fun joinCampaign(user: User, code: UUID): Boolean {
        val campaignQuery = repository.findByInviteCode(code)
        if (!campaignQuery.isPresent || campaignQuery.get().members.contains(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.members.add(user)
        this.repository.save(campaign)
        return true
    }

    fun rotateInviteCode(user: User, id: UUID): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.inviteCode = UUID.randomUUID()
        this.repository.save(campaign)
        return true
    }

    fun leaveCampaign(user: User, id: UUID): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent ||
                !campaignQuery.get().members.contains(user) ||
                campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.members.remove(user)
        this.repository.save(campaign)
        return true
    }

    fun kickFromCampaign(user: User, campaignId: UUID, userId: UUID): Boolean {
        val campaignQuery = repository.findById(campaignId)
        if (!campaignQuery.isPresent ||
                campaignQuery.get().members.find { it.id == userId } == null ||
                campaignQuery.get().owner.id == userId ||
                !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        campaign.members.removeIf { it.id == userId }
        this.repository.save(campaign)
        return true
    }

    fun deleteCampaign(user: User, id: UUID): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        repository.delete(campaignQuery.get())
        return true
    }

    fun getCampaignCharacters(user: User, id: UUID): List<Character>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.characters.filter { campaign.isOwnedBy(user) || it.isVisible }
    }

    fun createCharacter(user: User, id: UUID, name: String, description: String): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().isOwnedBy(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        val newCharacter = Character(name, description, false, campaign, mutableListOf())
        campaign.characters.add(newCharacter)
        this.repository.save(campaign)
        return true
    }

    fun getProposedCharacters(user: User, id: UUID): List<ProposedCharacter>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().members.contains(user)) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.proposedCharacters.filter { campaign.isOwnedBy(user) || it.proposedBy == user }
    }

    fun proposeCharacter(user: User, id: UUID, name: String, description: String): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().members.contains(user)) {
            return false
        }
        val campaign = campaignQuery.get()
        if (campaign.autoAcceptProposedCharacter) {
            val newCharacter = Character(name, description, true, campaign)
            campaign.characters.add(newCharacter)
        } else {
            val newProposedCharacter = ProposedCharacter(name, description, campaign, user)
            campaign.proposedCharacters.add(newProposedCharacter)
        }
        this.repository.save(campaign)
        return true
    }

    fun getCampaignMembers(user: User, id: UUID): Map<User, Boolean>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.members.map { it to campaign.isOwnedBy(it) }.toMap()
    }

    fun getNotes(user: User, campaignId: UUID): List<CampaignNote>? {
        val campaignQuery = repository.findById(campaignId)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return campaign.notes.filter { it.author == user }
    }

    fun getSharedNotes(user: User, campaignId: UUID): List<CampaignNote>? {
        val campaignQuery = repository.findById(campaignId)
        if (!campaignQuery.isPresent || !(campaignQuery.get().members.contains(user))) {
            return null
        }
        val campaign = campaignQuery.get()
        return if (campaign.isOwnedBy(user)) {
            campaign.notes.filter {
                it.author != user &&
                        (it.visibility === NoteVisibility.DM_SHARED || it.visibility === NoteVisibility.PUBLIC)
            }
        } else {
            campaign.notes.filter { it.author != user && it.visibility === NoteVisibility.PUBLIC }
        }
    }

    fun createNote(user: User, id: UUID, contents: String, rawVisibility: String): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().members.contains(user)) {
            return false
        }
        val visibility = try { NoteVisibility.valueOf(rawVisibility) } catch (e: IllegalArgumentException) { return false }
        val campaign = campaignQuery.get()
        val newNote = CampaignNote(contents, user, campaign, visibility)
        campaign.notes.add(newNote)
        this.repository.save(campaign)
        return true
    }

    fun createLabel(user: User, id: UUID, name: String, visible: Boolean): Boolean {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent) {
            return false
        }
        val campaign = campaignQuery.get()
        if (!campaign.isOwnedBy(user) && !(campaign.isAccessibleBy(user) && campaign.allowPlayerLabelManagement)) {
            return false
        }
        // Only owner can create invisible labels
        if (!campaign.isOwnedBy(user) && !visible) {
            return false
        }
        // Only allow one copy of a label with a certain name and visibility combination
        if (labelRepository.findAll().any { it.isVisible == visible && it.name == name }) {
            return false
        }
        val newLabel = Label(name, visible, campaign)
        campaign.labels.add(newLabel)
        this.repository.save(campaign)
        return true
    }

    fun getLabels(user: User, id: UUID): List<Label>? {
        val campaignQuery = repository.findById(id)
        if (!campaignQuery.isPresent || !campaignQuery.get().members.contains(user)) {
            return null
        }
        return campaignQuery.get().labels.filter { campaignQuery.get().isOwnedBy(user) || it.isVisible }
    }
}
