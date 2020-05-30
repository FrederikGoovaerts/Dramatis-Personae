import * as React from 'react';
import { Header } from './Header';
import { Button, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Redirect } from 'react-router';
import { routes } from '../../config/constants';

interface State {
    return: boolean;
}

export class CampaignHeader extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { return: false };
    }

    render() {
        if (this.state.return) {
            return <Redirect to={routes.root} />;
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
                        <Typography>Back to campaign list</Typography>
                    </Button>
                }
            />
        );
    }
}

// export const CampaignHeader = () => <Header leftContent={<Button>TEST</Button>} />;
