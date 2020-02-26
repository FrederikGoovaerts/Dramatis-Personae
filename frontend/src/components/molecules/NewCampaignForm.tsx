import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';
import { connect } from 'react-redux';
import { campaignActions } from '../../store/actions';

interface Props {
    className?: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    newCampaign: (name: string) => void;
}

type AllProps = Props & MapProps;

interface State {
    name: string;
}

class NewCampaignFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { name: '' };
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleSubmit = () => {
        this.props.newCampaign(this.state.name);
        this.setState({ name: '' });
        if (this.props.onSubmitComplete) {
            this.props.onSubmitComplete();
        }
    };

    render() {
        return (
            <div className={this.props.className}>
                <TextField label="Name" value={this.state.name} onChange={this.handleChange} margin="dense" />
                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                    Create
                </Button>
            </div>
        );
    }
}

export const NewCampaignForm = connect(null, { newCampaign: campaignActions.actions.newCampaign })(NewCampaignFormRaw);
