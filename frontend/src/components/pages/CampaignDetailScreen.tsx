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
import { Add, Visibility } from '@material-ui/icons';

import { routes } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ListCharacter, TabContent, Campaign } from '../../types';
import { ListItemLink } from '../atoms/ListItemLink';
import { CampaignCharacterBreadcrumb } from '../molecules/CampaignCharacterBreadcrumbs';
import { Header } from '../molecules/Header';
import { NewCharacterForm } from '../molecules/NewCharacterForm';
import { Fab, Modal } from '@material-ui/core';

export interface MatchParams {
    id: string;
}

interface Props {
    match: match<MatchParams>;
}

interface MapProps {
    campaign: Campaign | null;
    characters: ListCharacter[];
    loading: boolean;
    fetchCampaign: (id: string) => void;
    fetchCharacters: (campaignId: string) => void;
    deleteCampaign: (id: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    createOpen: boolean;
    deleteCheck: boolean;
    deleted: boolean;
}

class CampaignDetailRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { createOpen: false, deleteCheck: false, deleted: false };
    }

    componentDidMount(): void {
        this.props.fetchCampaign(this.props.match.params.id);
        this.props.fetchCharacters(this.props.match.params.id);
    }

    openCreate = (): void => {
        this.setState({ createOpen: true });
    };

    closeCreate = (): void => {
        this.setState({ createOpen: false });
    };

    // renderMemberList = () => {
    //     if (!this.props.campaign) {
    //         return undefined;
    //     }
    //     const campaign = this.props.campaign;
    //     return (
    //         <div className="centering">
    //             <div>
    //                 <Paper className="bottomSpaced">
    //                     <List>
    //                         one
    //                         {/* {campaign.members.map((name: string) => (
    //                             <ListItem key={name}>
    //                                 <ListItemText primary={name} />
    //                             </ListItem>
    //                         ))} */}
    //                     </List>
    //                 </Paper>
    //                 {campaign.owner && <Typography variant="caption">Invite code: {campaign.id}</Typography>}
    //             </div>
    //         </div>
    //     );
    // };

    renderCharacter = (character: ListCharacter) => (
        <ListItemLink to={`${this.props.match.url}${routes.character}${character.id}`} key={character.id}>
            <ListItemText primary={character.name} />
            {this.props.campaign?.owner && <Visibility color={character.visible ? 'primary' : 'disabled'} />}
        </ListItemLink>
    );

    renderCreateCharacter = () => {
        if (!this.props.campaign) {
            return <div />;
        }
        const campaign = this.props.campaign;
        return (
            <Paper className="CampaignDetail__createPaper">
                <Typography variant="h5">New character</Typography>
                <NewCharacterForm campaignId={campaign.id} className="CampaignDetail__createContainer" />
            </Paper>
        );
    };

    // handleCheckDelete = (event: ChangeEvent<HTMLInputElement>) => {
    //     this.setState({ deleteCheck: event.target.checked });
    // };

    // onDelete = () => {
    //     if (!this.props.campaign) {
    //         return undefined;
    //     }
    //     const campaign = this.props.campaign;
    //     this.props.deleteCampaign(campaign.id);
    //     this.setState({ deleted: true });
    // };

    // renderManageCampaign = () => {
    //     return (
    //         <div className="centering">
    //             <div className="flexColumn">
    //                 <FormControlLabel
    //                     control={<Checkbox checked={this.state.deleteCheck} onChange={this.handleCheckDelete} />}
    //                     label="I want to delete this campaign"
    //                 />
    //                 <Button
    //                     variant="contained"
    //                     color="secondary"
    //                     disabled={!this.state.deleteCheck}
    //                     onClick={this.onDelete}
    //                 >
    //                     Delete permanently
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // };

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
            const { campaign, characters } = this.props;
            contents = (
                <div>
                    <CampaignCharacterBreadcrumb campaign={campaign} />
                    <Typography variant={'h4'}>{campaign.name}</Typography>
                    <div className="bottomSpaced">
                        <Typography variant={'subtitle1'}>{`Run by ${
                            campaign.owner ? 'you' : campaign.ownerName
                        }`}</Typography>
                    </div>
                    {characters.length === 0 ? (
                        <Typography variant="body1">This campaign does not have any characters yet.</Typography>
                    ) : (
                        <Paper>
                            <List>{characters.map(this.renderCharacter)}</List>
                        </Paper>
                    )}
                    <Fab className="CampaignDetail__createFab" color="primary" onClick={this.openCreate}>
                        <Add />
                    </Fab>

                    <Modal open={this.state.createOpen} onClose={this.closeCreate}>
                        <div className="modal">{this.renderCreateCharacter()}</div>
                    </Modal>
                </div>
            );
        }
        return (
            <div className={'CampaignDetail__container'}>
                <Header />
                {contents}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    campaign: state.campaign.campaign,
    characters: state.campaign.characters,
    loading: state.campaign.campaignLoading || state.campaign.charactersLoading
});

export const CampaignDetailScreen = connect(mapStateToProps, {
    fetchCampaign: campaignActions.actions.fetchCampaign,
    fetchCharacters: campaignActions.actions.fetchCharacters,
    deleteCampaign: campaignActions.actions.deleteCampaign
})(CampaignDetailRaw);
