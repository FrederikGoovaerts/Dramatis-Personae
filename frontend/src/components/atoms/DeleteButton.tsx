import * as React from 'react';
import { Button } from '@material-ui/core';

type ButtonState = 'DEFAULT' | 'CLICKED' | 'DELETING';

interface Props {
    onConfirm: () => void;
    defaultText: string;
    confirmedText: string;
}

interface State {
    state: ButtonState;
}

export class ConfirmableButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { state: 'DEFAULT' };
    }

    private click = () => {
        this.setState({ state: 'CLICKED' });
    };

    private confirm = () => {
        this.setState({ state: 'DELETING' });
        this.props.onConfirm();
    };

    render() {
        if (this.state.state === 'DEFAULT') {
            return (
                <Button variant="outlined" color="secondary" onClick={this.click}>
                    {this.props.defaultText}
                </Button>
            );
        }
        if (this.state.state === 'CLICKED') {
            return (
                <Button variant="contained" color="secondary" onClick={this.confirm}>
                    Confirm
                </Button>
            );
        }
        return (
            <Button variant="contained" color="secondary" disabled>
                {this.props.confirmedText}
            </Button>
        );
    }
}

interface DeleteButtonProps {
    onConfirm: () => void;
}

export const DeleteButton = (props: DeleteButtonProps) => (
    <ConfirmableButton onConfirm={props.onConfirm} defaultText="Delete" confirmedText="Deleting..." />
);
