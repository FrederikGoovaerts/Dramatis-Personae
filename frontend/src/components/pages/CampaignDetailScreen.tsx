import './CampaignDetailScreen.scss';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItem from '@material-ui/core/ListItem';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match, Redirect } from 'react-router';
import Visibility from '@material-ui/icons/Visibility';

import { routes } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ListCharacter, TabContent } from '../../types';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { NewCharacterForm } from '../molecules/NewCharacterForm';

export interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface MapProps {
    campaign: any | null;
    loading: boolean;
    fetchCampaign: (id: string) => void;
    deleteCampaign: (id: number) => void;
}

type AllProps = Props & MapProps;

interface State {
    tab: number;
    deleteCheck: boolean;
    deleted: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { tab: 0, deleteCheck: false, deleted: false };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
    }

    renderMemberList = () => {
        if (!this.props.campaign) {
            return undefined;
        }
        const campaign = this.props.campaign;
        return (
            <div className="centering">
                <div>
                    <Paper className="bottomSpaced">
                        <List>
                            {campaign.members.map((name: string) => (
                                <ListItem key={name}>
                                    <ListItemText primary={name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    {campaign.ownedByMe && (
                        <Typography variant="caption">Invite code: {campaign.inviteCode}</Typography>
                    )}
                </div>
            </div>
        );
    };

    renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${this.props.match.url}${routes.character}${character.id}`}>
            <ListItemText primary={character.name} />
            {this.props.campaign && this.props.campaign.ownedByMe && (
                <Icon color={character.visible ? 'primary' : 'disabled'}>
                    <Visibility />
                </Icon>
            )}
        </ListItemLink>
    );

    renderCharacters = () => {
        if (!this.props.campaign) {
            return undefined;
        }
        const campaign = this.props.campaign;
        return (
            <Paper>
                <List>{campaign.characters.map(this.renderCharacter)}</List>
            </Paper>
        );
    };

    goToList = (): void => {
        this.setState({ tab: 0 });
    };

    renderCreateCharacter = () => {
        if (!this.props.campaign) {
            return undefined;
        }
        const campaign = this.props.campaign;
        return (
            <div className="centering">
                <NewCharacterForm
                    campaignId={campaign.id}
                    onSubmitComplete={this.goToList}
                    className="flexColumn CampaignDetailScreen__createContainer"
                />
            </div>
        );
    };

    handleCheckDelete = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ deleteCheck: event.target.checked });
    };

    onDelete = () => {
        if (!this.props.campaign) {
            return undefined;
        }
        const campaign = this.props.campaign;
        this.props.deleteCampaign(campaign.id);
        this.setState({ deleted: true });
    };

    renderManageCampaign = () => {
        return (
            <div className="centering">
                <div className="flexColumn">
                    <FormControlLabel
                        control={<Checkbox checked={this.state.deleteCheck} onChange={this.handleCheckDelete} />}
                        label="I want to delete this campaign"
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
            name: 'Characters',
            component: this.renderCharacters
        },
        {
            name: 'Campaign players',
            component: this.renderMemberList
        }
    ];

    ownerTabs: TabContent[] = [
        {
            name: 'Create Character',
            component: this.renderCreateCharacter
        },
        {
            name: 'Manage Campaign',
            component: this.renderManageCampaign
        }
    ];

    getTabs = (): TabContent[] =>
        this.props.campaign && this.props.campaign.ownedByMe ? [...this.tabs, ...this.ownerTabs] : this.tabs;

    handleTabChange = (event: ChangeEvent, value: number) => {
        this.setState({ tab: value });
    };

    render() {
        if (this.state.deleted) {
            return (
                <div>
                    <Redirect to={routes.root} />
                </div>
            );
        }

        let contents: React.ReactNode;
        if (this.props.loading || !this.props.campaign) {
            contents = <CircularProgress />;
        } else {
            const { campaign } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} />
                    <Typography variant={'h4'}>{campaign.name}</Typography>
                    <div className="bottomSpaced">
                        <Typography variant={'subtitle1'}>{`Run by ${
                            campaign.ownedByMe ? 'you' : campaign.owner
                        }`}</Typography>
                    </div>
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
            <div className={'campaignDetail__container'}>
                <Header />
                {contents}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaign: state.campaign.campaign,
    loading: state.campaign.campaignLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign,
    deleteCampaign: campaignActions.actions.deleteCampaign
})(CampaignDetailRaw);
