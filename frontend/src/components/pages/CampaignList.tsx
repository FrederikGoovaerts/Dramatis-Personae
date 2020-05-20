import './CampaignList.scss';

import { Grid, Paper, CircularProgress, Typography } from '@material-ui/core';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import { Link } from 'react-router-dom';

import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';

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

const campaignToListItemLink = (campaign: Campaign) => (
    <Link to={`/campaign/${campaign.id}`} key={campaign.id} className="CampaignList__campaignLink">
        <Paper className="CampaignList__campaignPaper">
            <Typography variant="h5" gutterBottom>
                {campaign.name}
            </Typography>
            <Typography variant="subtitle1">Run by {campaign.ownerName}</Typography>
        </Paper>
    </Link>
);

class CampaignListRaw extends React.Component<AllProps> {
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

    handleTabChange = (event: ChangeEvent, value: number) => {
        this.setState({ tab: value });
    };

    render() {
        const contents = this.props.loading ? (
            <CircularProgress />
        ) : (
            <div>
                {this.props.campaigns.length === 0 ? (
                    <Typography>You are currently not part of any campaigns!</Typography>
                ) : (
                    <Grid container justify="flex-start" spacing={2}>
                        {this.props.campaigns.map(campaignToListItemLink)}
                    </Grid>
                )}
                <div className="CampaignList__forms">
                    <NewCampaignForm className="CampaignList__formContainer" onSubmitComplete={this.goToList} />
                    <JoinCampaignForm className="CampaignList__formContainer" onSubmitComplete={this.goToList} />
                </div>
            </div>
        );

        return (
            <div className="CampaignList__container">
                <Header />
                <Typography variant="h4" gutterBottom>
                    Campaigns
                </Typography>
                <div className="CampaignList__content">{contents}</div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaigns: state.campaign.campaigns,
    loading: state.campaign.loading
});

export const CampaignList = connect(mapStateToProps, { fetchCampaigns: campaignActions.actions.fetchCampaigns })(
    CampaignListRaw
);
