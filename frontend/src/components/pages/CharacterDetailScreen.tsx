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
import { campaignActions, characterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Character, VisibilityUpdatePayload } from '../../types/character.types';
import { Campaign } from '../../types/campaign.types';
import { Note } from '../../types/note.types';
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    List,
    Divider,
    Modal,
    Box,
    FormControlLabel,
    Tooltip,
    ListItemIcon,
    Toolbar
} from '@material-ui/core';
import { Edit, Add, VisibilityOff } from '@material-ui/icons';
import { NewNoteForm } from '../molecules/NewNoteForm';
import { EditNoteForm } from '../molecules/EditNoteForm';
import { CharacterHeader } from '../molecules/CharacterHeader';

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
}

interface State {
    createOpen: boolean;
    editNote: Note | undefined;
    editCharacterOpen: boolean;
    deleteCheck: boolean;
    deleted: boolean;
}

type AllProps = Props & MapProps;

class CharacterDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            editNote: undefined,
            editCharacterOpen: false,
            deleteCheck: false,
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

    renderCreateNote = () => (
        <NewNoteForm
            characterId={this.props.match.params.characterId}
            className="CharacterDetail__modalContainer"
            onSubmitComplete={this.closeCreateNote}
        />
    );

    closeCreateNote = () => {
        this.setState({ createOpen: false });
    };

    closeEditCharacter = () => {
        this.setState({ editCharacterOpen: false });
    };

    renderEditNote = () => {
        if (!this.props.character || !this.state.editNote) {
            return <div />;
        }
        return (
            <EditNoteForm
                characterId={this.props.character.id}
                note={this.state.editNote}
                onSubmitComplete={this.closeEditNote}
            />
        );
    };

    closeEditNote = () => {
        this.setState({ editNote: undefined });
    };

    renderNote = (note: Note, own: boolean) => {
        const openEdit = () => this.setState({ editNote: note });
        return (
            <div key={note.id} className="CharacterDetail__note">
                <ListItem>
                    <ListItemText
                        primary={note.contents}
                        primaryTypographyProps={{ align: 'justify', className: 'CharacterDetail__noteContents' }}
                        secondary={`Created ${note.addedOn.fromNow()}, last edited ${note.editedOn.fromNow()}${
                            !own ? `, by ${note.authorName}` : ''
                        }`}
                    />
                    {!own && note.visibility === 'DM_SHARED' && (
                        <ListItemIcon>
                            <Tooltip title="Shared with DM only">
                                <VisibilityOff />
                            </Tooltip>
                        </ListItemIcon>
                    )}
                    {(own || this.props.campaign?.owner) && (
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={openEdit}>
                                <Edit />
                            </IconButton>
                        </ListItemSecondaryAction>
                    )}
                </ListItem>
            </div>
        );
    };

    renderOwnNote = (note: Note) => this.renderNote(note, true);

    renderSharedNote = (note: Note) => this.renderNote(note, false);

    renderNotes = (renderedNotes: JSX.Element[]) => {
        for (let i = 1; i < renderedNotes.length; i = i + 2) {
            renderedNotes.splice(i, 0, <Divider key={`divider${i}`} />);
        }
        return (
            <Paper>
                <List>{renderedNotes}</List>
            </Paper>
        );
    };

    renderOwnNotes = () => {
        const openCreate = () => this.setState({ createOpen: true });
        const renderedNotes = [
            ...this.props.notes.map(this.renderOwnNote),
            <div key={'addButton'} className="CharacterDetail__note">
                <ListItem className="CharacterDetail__addButtonItem">
                    <IconButton edge="end" color="primary" onClick={openCreate}>
                        <Add />
                    </IconButton>
                </ListItem>
            </div>
        ];
        return this.renderNotes(renderedNotes);
    };

    renderSharedNotes = () => this.renderNotes(this.props.sharedNotes.map(this.renderSharedNote));

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
            return <Redirect to={`${routes.campaign}${this.props.match.params.campaignId}`} />;
        }

        let contents: React.ReactNode;
        if (!this.props.character || !this.props.campaign || this.props.loading) {
            contents = <CircularProgress />;
        } else {
            const { character } = this.props;
            contents = (
                <Box>
                    <Box marginBottom="1em">
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
                    <Box marginBottom="1em">
                        <Typography variant="h5">Your notes</Typography>
                    </Box>
                    <Box marginBottom="2em">{this.renderOwnNotes()}</Box>
                    {this.props.sharedNotes.length > 0 && (
                        <Box marginBottom="1em">
                            <Typography variant="h5">Notes by others</Typography>
                        </Box>
                    )}
                    {this.props.sharedNotes.length > 0 && <Box marginBottom="2em">{this.renderSharedNotes()}</Box>}
                    <Modal open={this.state.createOpen} onClose={this.closeCreateNote}>
                        <div className="modal">{this.renderCreateNote()}</div>
                    </Modal>
                    <Modal open={this.state.editCharacterOpen} onClose={this.closeEditCharacter}>
                        <div className="modal">{this.renderEditCharacter()}</div>
                    </Modal>
                    <Modal open={this.state.editNote !== undefined} onClose={this.closeEditNote}>
                        <div className="modal">{this.renderEditNote()}</div>
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
    deleteCharacter: characterActions.actions.deleteCharacter
})(CharacterDetailRaw);
