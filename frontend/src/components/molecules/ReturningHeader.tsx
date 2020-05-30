import * as React from 'react';
import { Header } from './Header';
import { Button, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Redirect } from 'react-router';

interface Props {
    returnLabel: string;
    returnRoute: string;
}

interface State {
    return: boolean;
}

export class ReturningHeader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { return: false };
    }

    render() {
        if (this.state.return) {
            return <Redirect to={this.props.returnRoute} />;
        }
        return (
            <Header
                leftContent={
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.setState({ return: true });
                        }}
                    >
                        <ArrowBack />
                        <Typography>{this.props.returnLabel}</Typography>
                    </Button>
                }
            />
        );
    }
}
