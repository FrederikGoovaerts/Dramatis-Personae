import * as React from 'react';
import { Button } from '@material-ui/core';

interface Props {
    onConfirm: () => void;
}

interface State {
    clicked: boolean;
}

export class DeleteButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { clicked: false };
    }

    private click = () => {
        this.setState({ clicked: true });
    };

    private confirm = () => {
        this.setState({ clicked: false });
        this.props.onConfirm();
    };

    render() {
        if (!this.state.clicked) {
            return (
                <Button variant="outlined" color="secondary" onClick={this.click}>
                    Delete
                </Button>
            );
        }
        return (
            <Button variant="contained" color="secondary" onClick={this.confirm}>
                I&apos;m sure!
            </Button>
        );
    }
}
