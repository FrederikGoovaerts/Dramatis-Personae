import * as React from 'react';
import { Button } from '@material-ui/core';

type ButtonState = 'DEFAULT' | 'CLICKED' | 'DELETING';

interface Props {
    onConfirm: () => void;
}

interface State {
    state: ButtonState;
}

export class DeleteButton extends React.Component<Props, State> {
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
                    Delete
                </Button>
            );
        }
        if (this.state.state === 'CLICKED') {
            return (
                <Button variant="contained" color="secondary" onClick={this.confirm}>
                    I&apos;m sure!
                </Button>
            );
        }
        return (
            <Button variant="contained" color="secondary" disabled>
                Deleting...
            </Button>
        );
    }
}
