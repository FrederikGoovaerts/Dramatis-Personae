package dev.frederik.dramatispersonae.fixtures

import dev.frederik.dramatispersonae.model.*
import java.util.*

fun getTestUser(id: UUID = UUID.randomUUID(),
                googleId: String = UUID.randomUUID().toString(),
                name: String = "testUser",
                email: String = "testuser@example.com"): User = User(googleId, name, email, id = id)

fun getTestCampaign(id: UUID = UUID.randomUUID(),
                    name: String = "testCampaign",
                    owner: User = getTestUser(),
                    members: MutableList<User> = mutableListOf(owner)): Campaign = Campaign(name, owner, members, id = id)

fun getTestCharacter(id: UUID = UUID.randomUUID(),
                     name: String = "testCharacter",
                     description: String = "test description",
                     isVisible: Boolean = true,
                     campaign: Campaign = getTestCampaign()): Character = Character(name, description, isVisible, campaign, id = id)

fun getTestProposedCharacter(id: UUID = UUID.randomUUID(),
                             name: String = "testProposedCharacter",
                             description: String = "test description",
                             campaign: Campaign = getTestCampaign(),
                             proposedBy: User = getTestUser()): ProposedCharacter = ProposedCharacter(name, description, campaign, proposedBy, id = id)

fun getTestCharacterNote(id: UUID = UUID.randomUUID(),
                         contents: String = "test note",
                         user: User = getTestUser(),
                         character: Character = getTestCharacter(),
                         visibility: NoteVisibility = NoteVisibility.PUBLIC): CharacterNote = CharacterNote(contents, user, character, visibility, id = id)

fun getTestCampaignNote(id: UUID = UUID.randomUUID(),
                        contents: String = "test note",
                        user: User = getTestUser(),
                        campaign: Campaign = getTestCampaign(),
                        visibility: NoteVisibility = NoteVisibility.PUBLIC): CampaignNote = CampaignNote(contents, user, campaign, visibility, id = id)

fun getTestLabel(id: UUID = UUID.randomUUID(),
                 name: String = "testLabel",
                 visibility: Boolean = true,
                 campaign: Campaign = getTestCampaign()): Label = Label(name, visibility, campaign, id = id)
