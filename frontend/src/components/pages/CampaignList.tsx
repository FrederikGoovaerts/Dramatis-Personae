import './CampaignList.scss';

import { Box, CircularProgress, Grid, Paper, Toolbar, Typography } from '@material-ui/core';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';
import { Link } from 'react-router-dom';

import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { JoinCampaignForm } from '../molecules/campaign/JoinCampaignForm';
import { NewCampaignForm } from '../molecules/campaign/NewCampaignForm';
import { Header } from '../molecules/header/Header';

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
                <Toolbar />
                <Box marginY="1em">
                    <Typography variant="h4">Campaigns</Typography>
                </Box>
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
