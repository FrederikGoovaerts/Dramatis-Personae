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
    loading: boolean;
    fetchCharacter: (id: string) => void;
    fetchNotes: (id: string) => void;
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
    }

    handleToggleVisible = (event: ChangeEvent<HTMLInputElement>) => {
        if (this.props.character) {
            this.props.setVisible({ characterId: this.props.character.id, visible: event.target.checked });
        }
    };

    renderCreateNote = () => {
        if (!this.props.character) {
            return <div />;
        }
        const character = this.props.character;
        return (
            <NewNoteForm
                characterId={character.id}
                className="CharacterDetail__modalContainer"
                onSubmitComplete={this.closeCreateNote}
            />
        );
    };

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

    renderNote = (note: Note) => {
        const openEdit = () => this.setState({ editNote: note });
        return (
            <div key={note.id} className="CharacterDetail__note">
                <ListItem>
                    <ListItemText
                        primary={note.contents}
                        primaryTypographyProps={{ align: 'justify', className: 'CharacterDetail__noteContents' }}
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={openEdit}>
                            <Edit />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </div>
        );
    };

    renderNotes = () => {
        const openCreate = () => this.setState({ createOpen: true });
        return (
            <Paper>
                <List>
                    {this.props.notes.map(this.renderNote)}
                    <div key={'addButton'} className="CharacterDetail__note">
                        <ListItem className="CharacterDetail__addButtonItem">
                            <IconButton edge="end" color="primary" onClick={openCreate}>
                                <Add />
                            </IconButton>
                        </ListItem>
                    </div>
                </List>
            </Paper>
        );
    };

    renderEditCharacter = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        return (
            <EditCharacterForm
                characterId={character.id}
                initialName={character.name}
                initialDescription={character.description}
                onSubmitComplete={this.closeEditCharacter}
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
                    {this.renderNotes()}
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
    loading: state.character.loading && state.campaign.loading && state.character.notesLoading
});

export const CharacterDetailScreen = connect(mapStateToProps, {
    fetchCharacter: characterActions.actions.fetchCharacter,
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchNotes: characterActions.actions.fetchNotes,
    setVisible: characterActions.actions.setVisible,
    deleteCharacter: characterActions.actions.deleteCharacter
})(CharacterDetailRaw);
