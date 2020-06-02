import './CharacterDetailScreen.scss';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';

import { routes } from '../../config/constants';
import { EditCharacterForm } from '../molecules/EditCharacterForm';
import { campaignActions, characterActions, noteActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Character, VisibilityUpdatePayload } from '../../types/character.types';
import { Campaign } from '../../types/campaign.types';
import { Note, EditNotePayload, DeleteNotePayload, NoteVisibility, CreateNotePayload } from '../../types/note.types';
import { IconButton, Modal, Box, FormControlLabel, Toolbar } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { CharacterHeader } from '../molecules/CharacterHeader';
import { Notes } from '../molecules/Notes';

export interface MatchParams {
    campaignId: string;
    characterId: string;
}

interface Props {
    match: match<MatchParams>;
}

interface MapProps {
    character: Character | null;
    campaign: Campaign | null;
    notes: Note[];
    sharedNotes: Note[];
    loading: boolean;
    fetchCharacter: (id: string) => void;
    fetchNotes: (id: string) => void;
    fetchSharedNotes: (id: string) => void;
    fetchCampaign: (id: string) => void;
    setVisible: (payload: VisibilityUpdatePayload) => void;
    createNote: (payload: CreateNotePayload) => void;
    editCharacterNote: (payload: EditNotePayload) => void;
    deleteCharacterNote: (payload: DeleteNotePayload) => void;
}

interface State {
    editCharacterOpen: boolean;
    deleted: boolean;
}

type AllProps = Props & MapProps;

class CharacterDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            editCharacterOpen: false,
            deleted: false
        };
    }

    componentDidMount(): void {
        this.props.fetchCharacter(this.props.match.params.characterId);
        this.props.fetchCampaign(this.props.match.params.campaignId);
        this.props.fetchNotes(this.props.match.params.characterId);
        this.props.fetchSharedNotes(this.props.match.params.characterId);
    }

    handleToggleVisible = (event: ChangeEvent<HTMLInputElement>) => {
        if (this.props.character) {
            this.props.setVisible({ characterId: this.props.character.id, visible: event.target.checked });
        }
    };

    closeEditCharacter = () => {
        this.setState({ editCharacterOpen: false });
    };

    renderEditCharacter = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        const onDelete = () => this.setState({ deleted: true });
        return (
            <EditCharacterForm
                characterId={character.id}
                initialName={character.name}
                initialDescription={character.description}
                onSubmitComplete={this.closeEditCharacter}
                onDelete={onDelete}
            />
        );
    };

    render() {
        if (this.state.deleted) {
            return <Redirect to={`${routes.campaign.path}${this.props.match.params.campaignId}`} />;
        }

        let contents: React.ReactNode;
        if (!this.props.character || !this.props.campaign || this.props.loading) {
            contents = <CircularProgress />;
        } else {
            const { character } = this.props;
            contents = (
                <Box>
                    <Box marginY="1em">
                        <Typography variant="subtitle1">{character.description}</Typography>
                    </Box>
                    {this.props.campaign.owner && (
                        <Paper className="CharacterDetail__adminControls">
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        onChange={this.handleToggleVisible}
                                        checked={character.visible}
                                    />
                                }
                                label="Visible to players"
                            />
                            <FormControlLabel
                                control={
                                    <IconButton onClick={() => this.setState({ editCharacterOpen: true })}>
                                        <Edit />
                                    </IconButton>
                                }
                                label="Edit character"
                            />
                        </Paper>
                    )}
                    <Notes
                        campaignOwner={this.props.campaign.owner}
                        notes={this.props.notes}
                        sharedNotes={this.props.sharedNotes}
                        editNote={(noteId: string, contents: string, visibility: NoteVisibility) =>
                            this.props.editCharacterNote({ id: character.id, noteId, contents, visibility })
                        }
                        deleteNote={(noteId: string) => this.props.deleteCharacterNote({ id: character.id, noteId })}
                        createNote={(contents: string, visibility: NoteVisibility) =>
                            this.props.createNote({ id: character.id, contents, visibility })
                        }
                    />
                    <Modal open={this.state.editCharacterOpen} onClose={this.closeEditCharacter}>
                        <div className="modal">{this.renderEditCharacter()}</div>
                    </Modal>
                </Box>
            );
        }
        return (
            <Box className="CharacterDetail__container">
                <CharacterHeader campaignId={this.props.match.params.campaignId} name={this.props.character?.name} />
                <Toolbar />
                {contents}
            </Box>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    character: state.character.character,
    campaign: state.campaign.campaign,
    notes: state.character.notes,
    sharedNotes: state.character.sharedNotes,
    loading:
        state.character.loading &&
        state.campaign.loading &&
        state.character.notesLoading &&
        state.character.sharedNotesLoading
});

export const CharacterDetailScreen = connect(mapStateToProps, {
    fetchCharacter: characterActions.actions.fetchCharacter,
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchNotes: characterActions.actions.fetchNotes,
    fetchSharedNotes: characterActions.actions.fetchSharedNotes,
    setVisible: characterActions.actions.setVisible,
    deleteCharacter: characterActions.actions.deleteCharacter,
    createNote: characterActions.actions.createNote,
    editCharacterNote: noteActions.actions.editCharacterNote,
    deleteCharacterNote: noteActions.actions.deleteCharacterNote
})(CharacterDetailRaw);
