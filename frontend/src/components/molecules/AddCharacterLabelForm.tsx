import * as React from 'react';
import { connect } from 'react-redux';
import { AddLabelPayload, Label } from '../../types/label.types';
import { RootState } from '../../store/reducers';
import { campaignActions, characterActions } from '../../store/actions';
import { Character } from '../../types/character.types';
import {
    CircularProgress,
    Typography,
    Paper,
    Select,
    Chip,
    MenuItem,
    Button,
    FormControl,
    InputLabel
} from '@material-ui/core';

interface Props {
    campaignId: string;
    character: Character;
    onSubmitComplete: () => void;
}

interface MapProps {
    labels: Label[];
    loading: boolean;
    fetchLabels: (campaignId: string) => void;
    addLabel: (payload: AddLabelPayload) => void;
}

interface State {
    selected: string;
}

type AllProps = Props & MapProps;

class AddCharacterLabelFormRaw extends React.Component<AllProps, State> {
    constructor(props: AllProps) {
        super(props);
        this.state = { selected: '' };
    }

    componentDidMount() {
        this.props.fetchLabels(this.props.campaignId);
    }

    handleSelect = (
        event: React.ChangeEvent<{
            value: string;
        }>
    ) => {
        this.setState({ selected: event.target.value });
    };

    handleSubmit = () => {
        this.props.addLabel({ characterId: this.props.character.id, labelId: this.state.selected });
        this.props.onSubmitComplete();
    };

    render() {
        if (this.props.loading) {
            return <CircularProgress />;
        }
        return (
            <Paper className="modalPaper">
                <div className="modalContainer">
                    <div className="modalHeader">
                        <Typography variant="h5">Add label(s)</Typography>
                    </div>
                    <FormControl>
                        <InputLabel>Label</InputLabel>
                        <Select value={this.state.selected} onChange={this.handleSelect}>
                            {this.props.labels.map((label: Label) => (
                                <MenuItem key={label.id} value={label.id}>
                                    {label.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        onClick={this.handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={this.state.selected === ''}
                    >
                        Add
                    </Button>
                </div>
            </Paper>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    labels: state.campaign.labels,
    loading: state.campaign.labelsLoading
});

export const AddCharacterLabelForm = connect(mapStateToProps, {
    addLabel: characterActions.actions.addLabel,
    fetchLabels: campaignActions.actions.fetchLabels
})(AddCharacterLabelFormRaw);
