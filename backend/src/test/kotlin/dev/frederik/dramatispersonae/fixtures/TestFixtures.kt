package dev.frederik.dramatispersonae.fixtures

import dev.frederik.dramatispersonae.model.*

fun getTestUser(id: String = "1",
                name: String = "testUser",
                email: String = "testuser@example.com"): User = User(id, name, email)

fun getTestCampaign(name: String = "testCampaign",
                    owner: User = getTestUser(),
                    members: MutableList<User> = mutableListOf(owner)): Campaign = Campaign(name, owner, members)

fun getTestCharacter(name: String = "testCharacter",
                     description: String = "test description",
                     isVisible: Boolean = true,
                     campaign: Campaign = getTestCampaign()): Character = Character(name, description, isVisible, campaign)

fun getTestProposedCharacter(name: String = "testProposedCharacter",
                             description: String = "test description",
                             campaign: Campaign = getTestCampaign(),
                             proposedBy: User = getTestUser()): ProposedCharacter = ProposedCharacter(name, description, campaign, proposedBy)

fun getTestCharacterNote(contents: String = "test note",
                         user: User = getTestUser(),
                         character: Character = getTestCharacter(),
                         visibility: NoteVisibility = NoteVisibility.PUBLIC): CharacterNote = CharacterNote(contents, user, character, visibility)

fun getTestCampaignNote(contents: String = "test note",
                        user: User = getTestUser(),
                        campaign: Campaign = getTestCampaign(),
                        visibility: NoteVisibility = NoteVisibility.PUBLIC): CampaignNote = CampaignNote(contents, user, campaign, visibility)

fun getTestLabel(name: String = "testLabel",
                 visibility: Boolean = true,
                 campaign: Campaign = getTestCampaign()): Label = Label(name, visibility, campaign)
