import './CampaignList.scss';

import { Box, CircularProgress, Grid, Toolbar, Typography } from '@material-ui/core';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { match } from 'react-router';

import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { CampaignLink } from '../atoms/CampaignLink';
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
                        {this.props.campaigns.map((campaign) => (
                            <CampaignLink
                                key={campaign.id}
                                id={campaign.id}
                                name={campaign.name}
                                ownerName={campaign.ownerName}
                            />
                        ))}
                    </Grid>
                )}
                <Box marginTop="1em">
                    <NewCampaignForm className="CampaignList__formContainer" onSubmitComplete={this.goToList} />
                </Box>
            </div>
        );

        return (
            <div className="CampaignList__container">
                <Header />
                <Toolbar />
                <Box marginY="1em">
                    <Typography variant="h4">Campaigns</Typography>
                </Box>
                <div>{contents}</div>
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
