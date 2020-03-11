import './CharacterDetailScreen.scss';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import { routes } from '../../config/constants';

import { campaignActions, characterActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import {
    Campaign,
    Character,
    CharacterDeletePayload,
    CreateNotePayload,
    TabContent,
    VisibilityUpdatePayload
} from '../../types';
import { SpacedDivider } from '../atoms/SpacedDivider';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { UpdateCharacterForm } from '../molecules/UpdateCharacterForm';

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
    loading: boolean;
    fetchCharacter: (id: string) => void;
    fetchCampaign: (id: string) => void;
    setNote: (payload: CreateNotePayload) => void;
    setVisible: (payload: VisibilityUpdatePayload) => void;
    deleteCharacter: (payload: CharacterDeletePayload) => void;
}

interface State {
    note: string | undefined;
    tab: number;
    deleteCheck: boolean;
    deleted: boolean;
}

type AllProps = Props & MapProps;

class CharacterDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            note: undefined,
            tab: 0,
            deleteCheck: false,
            deleted: false
        };
    }

    componentDidMount(): void {
        this.props.fetchCharacter(this.props.match.params.characterId);
        this.props.fetchCampaign(this.props.match.params.campaignId);
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

    handleChangeNote = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ note: event.target.value });
    };

    handleSubmit = () => {
        if (this.props.character && this.state.note !== undefined) {
            this.props.setNote({ characterId: this.props.character.id, note: this.state.note });
            this.setState({ note: undefined });
        }
    };

    renderNotes = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        return (
            <div>
                <div>
                    <Button
                        disabled={this.state.note === undefined}
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        Save notes
                    </Button>
                </div>
            </div>
        );
    };

    renderDescription = () => {
        if (!this.props.character) {
            return undefined;
        }
        const character = this.props.character;
        return (
            <div className="centering">
                <Typography>{character.description}</Typography>
            </div>
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

    tabs: TabContent[] = [
        {
            name: 'Character information',
            component: this.renderDescription
        },
        {
            name: 'Personal notes',
            component: this.renderNotes
        }
    ];

    ownerTabs: TabContent[] = [
        {
            name: 'Manage Character',
            component: this.renderManageCharacter
        }
    ];

    getTabs = (): TabContent[] =>
        this.props.campaign && this.props.campaign.owner ? [...this.tabs, ...this.ownerTabs] : this.tabs;

    handleTabChange = (event: ChangeEvent, value: number) => {
        this.setState({ tab: value });
    };

    render() {
        if (this.state.deleted) {
            return (
                <div>
                    <Redirect to={`${routes.campaign}${this.props.match.params.campaignId}`} />
                </div>
            );
        }

        let contents: React.ReactNode;
        if (!this.props.character || !this.props.campaign || this.props.loading) {
            contents = <CircularProgress />;
        } else {
            const { campaign, character } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} character={character} />
                    <Typography variant="h4">{character.name}</Typography>
                    {this.props.campaign.owner && this.renderVisibilityToggle(this.props.character)}
                    <div className="bottomSpaced">
                        <Paper>
                            <Tabs
                                value={this.state.tab}
                                onChange={this.handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                {this.getTabs().map((tab) => (
                                    <Tab key={tab.name} label={tab.name} />
                                ))}
                            </Tabs>
                        </Paper>
                    </div>
                    {this.getTabs()[this.state.tab].component()}
                </div>
            );
        }
        return (
            <div className="campaignDetail__container">
                <Header />
                {contents}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    character: state.character.character,
    campaign: state.campaign.campaign,
    loading: state.character.loading && state.campaign.loading
});

export const CharacterDetailScreen = connect(mapStateToProps, {
    fetchCharacter: characterActions.actions.fetchCharacter,
    setNote: characterActions.actions.setNote,
    fetchCampaign: campaignActions.actions.fetchCampaign,
    setVisible: characterActions.actions.setVisible,
    deleteCharacter: characterActions.actions.deleteCharacter
})(CharacterDetailRaw);
