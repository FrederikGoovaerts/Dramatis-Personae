import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../store/actions';

interface Props {
    className: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    joinCampaign: (code: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    input: string;
}

class JoinCampaignFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { input: '' };
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ input: event.target.value });
    };

    handleSubmit = () => {
        this.props.joinCampaign(this.state.input);
        this.setState({ input: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <div className={this.props.className}>
                <TextField label="Invite code" value={this.state.input} onChange={this.handleChange} margin="dense" />
                <Button variant="contained" onClick={this.handleSubmit}>
                    Join
                </Button>
            </div>
        );
    }
}

export const JoinCampaignForm = connect(null, { joinCampaign: campaignActions.actions.joinCampaign })(
    JoinCampaignFormRaw
);
