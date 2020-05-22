import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from 'react';
import * as React from 'react';

interface Props {
    className?: string;
    onSubmit: (name: string, description: string) => void;
}

interface State {
    name: string;
    description: string;
}

export class NewCharacterForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { name: '', description: '' };
    }

    handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value });
    };

    handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ description: event.target.value });
    };

    handleSubmit = () => {
        this.props.onSubmit(this.state.name, this.state.description);
        this.setState({ name: '', description: '' });
    };

    render() {
        return (
            <div className={this.props.className}>
                <TextField
                    label="Name"
                    required
                    helperText="The name of the new character."
                    value={this.state.name}
                    onChange={this.handleChangeName}
                    margin="dense"
                />
                <TextField
                    multiline
                    rows={3}
                    variant="outlined"
                    label="Description"
                    helperText="This should contain basic information other characters clearly see or know about the character."
                    value={this.state.description}
                    onChange={this.handleChangeDescription}
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={this.handleSubmit} disabled={!this.state.name}>
                    Create
                </Button>
            </div>
        );
    }
}
