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
import { Campaign, Character, VisibilityUpdatePayload, Note } from '../../types';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    List,
    Divider,
    Modal,
    Box,
    FormControlLabel
} from '@material-ui/core';
import { Edit, Add } from '@material-ui/icons';
import { NewNoteForm } from '../molecules/NewNoteForm';
import { EditNoteForm } from '../molecules/EditNoteForm';

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
                noteId={this.state.editNote.id}
                noteContents={this.state.editNote.contents}
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
                        secondary={`Created ${note.addedOn.fromNow()}, last edited ${note.editedOn.fromNow()}`}
                    />
                    {own && (
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
            const { campaign, character } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} character={character} />
                    <Box className="CharacterDetail__header">
                        <Typography gutterBottom variant="h4">
                            {character.name}
                        </Typography>
                        <Typography gutterBottom className="CharacterDetail__descriptionContents">
                            {character.description}
                        </Typography>

                        {this.props.campaign.owner && (
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
                        )}
                        {this.props.campaign.owner && (
                            <FormControlLabel
                                control={
                                    <IconButton onClick={() => this.setState({ editCharacterOpen: true })}>
                                        <Edit />
                                    </IconButton>
                                }
                                label="Edit character"
                            />
                        )}
                    </Box>
                    <Box marginBottom="1em">
                        <Typography variant="h5">Your notes</Typography>
                    </Box>
                    {this.renderOwnNotes()}

                    <Box marginBottom="1em" marginTop="2em">
                        <Typography variant="h5">Notes by others</Typography>
                    </Box>
                    {this.renderSharedNotes()}
                    <Modal open={this.state.createOpen} onClose={this.closeCreateNote}>
                        <div className="modal">{this.renderCreateNote()}</div>
                    </Modal>
                    <Modal open={this.state.editCharacterOpen} onClose={this.closeEditCharacter}>
                        <div className="modal">{this.renderEditCharacter()}</div>
                    </Modal>
                    <Modal open={this.state.editNote !== undefined} onClose={this.closeEditNote}>
                        <div className="modal">{this.renderEditNote()}</div>
                    </Modal>
                </div>
            );
        }
        return (
            <div className="CharacterDetail__container">
                <Header />
                {contents}
            </div>
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
