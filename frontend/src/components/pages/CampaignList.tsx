import './CampaignList.scss';

import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';

import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign, TabContent } from '../../types';
import { ListItemLink } from '../atoms/ListItemLink';

import { Header } from '../molecules/Header';
import { JoinCampaignForm } from '../molecules/JoinCampaignForm';
import { NewCampaignForm } from '../molecules/NewCampaignForm';

interface Props {
    match: match<{}>;
}

interface MapProps {
    fetchCampaigns: () => void;
    campaigns: Campaign[];
    loading: boolean;
}

type AllProps = Props & MapProps;

interface State {
    tab: number;
}

const campaignToListItemLink = (campaign: Campaign) => (
    <ListItemLink to={`/campaign/${campaign.id}`} key={campaign.id}>
        <ListItemText primary={campaign.name} secondary={`Run by ${campaign.ownedByMe ? 'you' : campaign.owner}`} />
    </ListItemLink>
);

class CampaignListRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { tab: 0 };
    }

    componentDidMount(): void {
        this.props.fetchCampaigns();
    }

    goToList = (): void => {
        this.setState({ tab: 0 });
    };

    renderList = () => {
        if (this.props.loading) {
            return <CircularProgress />;
        } else if (this.props.campaigns.length === 0) {
            return (
                <div>
                    <Typography>You currently are not part of any campaigns!</Typography>
                </div>
            );
        } else {
            return (
                <Paper>
                    <List component="nav">{this.props.campaigns.map(campaignToListItemLink)}</List>
                </Paper>
            );
        }
    };

    renderNewCampaignForm = () => (
        <NewCampaignForm className="CampaignList__formContainer" onSubmitComplete={this.goToList} />
    );

    renderJoinCampaignForm = () => (
        <JoinCampaignForm className="CampaignList__formContainer" onSubmitComplete={this.goToList} />
    );

    tabs: TabContent[] = [
        {
            name: 'Campaign List',
            component: this.renderList,
        },
        {
            name: 'New Campaign',
            component: this.renderNewCampaignForm,
        },
        {
            name: 'Join Campaign',
            component: this.renderJoinCampaignForm,
        },
    ];

    handleTabChange = (event: ChangeEvent, value: number) => {
        this.setState({ tab: value });
    };

    render() {
        const contents = this.tabs[this.state.tab].component();

        return (
            <div className="CampaignList__container">
                <Header />
                <Typography variant="h4" gutterBottom>
          Campaigns
                </Typography>
                <div className="CampaignList__tabs">
                    <Paper>
                        <Tabs
                            value={this.state.tab}
                            onChange={this.handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            {this.tabs.map((tab) => (
                                <Tab key={tab.name} label={tab.name} />
                            ))}
                        </Tabs>
                    </Paper>
                </div>
                <div className="CampaignList__content">{contents}</div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaigns: state.campaign.campaigns,
    loading: state.campaign.loading,
});

export const CampaignList = connect(
    mapStateToProps,
    { fetchCampaigns: campaignActions.actions.fetchCampaigns },
)(CampaignListRaw);
