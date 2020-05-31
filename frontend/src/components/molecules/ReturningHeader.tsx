import * as React from 'react';
import { Header } from './Header';
import { Button, Typography, Box } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Redirect } from 'react-router';

interface Props {
    title?: string;
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
                    <Box display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                this.setState({ return: true });
                            }}
                            startIcon={<ArrowBack />}
                        >
                            {this.props.returnLabel}
                        </Button>
                        {this.props.title && (
                            <Box marginLeft="1em">
                                <Typography variant="h5">{this.props.title}</Typography>
                            </Box>
                        )}
                    </Box>
                }
            />
        );
    }
}
