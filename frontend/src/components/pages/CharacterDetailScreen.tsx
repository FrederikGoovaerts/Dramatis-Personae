import './CharacterDetailScreen.scss';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import { routes } from '../../config/constants';

import { campaignActions, characterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign, Character, CharacterDeletePayload, VisibilityUpdatePayload, Note } from '../../types';
import { SpacedDivider } from '../atoms/SpacedDivider';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { UpdateCharacterForm } from '../molecules/UpdateCharacterForm';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, List, Divider, Modal } from '@material-ui/core';
import { Edit, Add } from '@material-ui/icons';

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
    deleteCharacter: (payload: CharacterDeletePayload) => void;
}

interface State {
    createOpen: boolean;
    editId: string | undefined;
    deleteCheck: boolean;
    deleted: boolean;
}

type AllProps = Props & MapProps;

class CharacterDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            createOpen: false,
            editId: undefined,
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

    renderVisibilityToggle(character: Character) {
        return (
            <div className="CharacterDetailScreen__visibilityContainer">
                <Typography>Visible to players:</Typography>
                <Switch color="primary" onChange={this.handleToggleVisible} checked={character.visible} />
            </div>
        );
    }

    renderDescription = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        return (
            <div className="CharacterDetail__descriptionContainer">
                <Typography className="CharacterDetail__descriptionTitle">About this character:</Typography>
                <Typography className="CharacterDetail__descriptionContents">{character.description}</Typography>
            </div>
        );
    };

    renderCreateNote = () => <div></div>;

    closeCreateNote = () => {
        this.setState({ createOpen: false });
    };

    renderEditNote = () => <div></div>;

    closeEditNote = () => {
        this.setState({ editId: undefined });
    };

    renderNote = (note: Note) => {
        const openEdit = () => this.setState({ editId: note.id });
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

    handleCheckDelete = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ deleteCheck: event.target.checked });
    };

    onDelete = () => {
        if (!this.props.character || !this.props.campaign) {
            return undefined;
        }
        const character = this.props.character;
        const campaign = this.props.campaign;
        this.props.deleteCharacter({ characterId: character.id, campaignId: campaign.id });
        this.setState({ deleted: true });
    };

    renderManageCharacter = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        return (
            <div className="centering">
                <div className="flexColumn">
                    <UpdateCharacterForm
                        characterId={character.id}
                        initialName={character.name}
                        initialDescription={character.description}
                        className="flexColumn CampaignDetailScreen__createContainer"
                    />
                    <SpacedDivider />
                    <FormControlLabel
                        control={<Checkbox checked={this.state.deleteCheck} onChange={this.handleCheckDelete} />}
                        label="I want to delete this character"
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={!this.state.deleteCheck}
                        onClick={this.onDelete}
                    >
                        Delete permanently
                    </Button>
                </div>
            </div>
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
                    <Typography variant="h4" gutterBottom>
                        {character.name}
                    </Typography>
                    {this.props.campaign.owner && this.renderVisibilityToggle(this.props.character)}
                    {this.renderDescription()}
                    {this.renderNotes()}
                    <Modal open={this.state.createOpen} onClose={this.closeCreateNote}>
                        <div className="modal">{this.renderCreateNote()}</div>
                    </Modal>
                    <Modal open={this.state.editId !== undefined} onClose={this.closeEditNote}>
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
