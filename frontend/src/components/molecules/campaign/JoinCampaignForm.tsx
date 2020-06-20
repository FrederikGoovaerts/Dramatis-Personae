import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { campaignActions } from '../../../store/actions';

interface Props {
    className: string;
    onSubmitComplete?: () => void;
}

interface MapProps {
    joinCampaign: (code: string) => void;
}

type AllProps = Props & MapProps;

const JoinCampaignFormRaw = (props: AllProps) => {
    const [input, setInput] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = () => {
        props.joinCampaign(input);
        setInput('');
        if (props.onSubmitComplete) {
            props.onSubmitComplete();
        }
    };

    return (
        <div className={props.className}>
            <TextField label="Campaign invite code" value={input} onChange={handleChange} margin="dense" />
            <Button variant="contained" onClick={handleSubmit}>
                Join
            </Button>
        </div>
    );
};

export const JoinCampaignForm = connect(null, { joinCampaign: campaignActions.actions.joinCampaign })(
    JoinCampaignFormRaw
);
