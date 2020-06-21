import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '../../config/constants';

interface Props {
    id: string;
    name: string;
    ownerName: string;
}

const useStyles = makeStyles({
    link: {
        display: 'flex',
        margin: '1em',
        flexDirection: 'column'
    },
    paper: {
        flex: 1,
        padding: '2em',
        maxWidth: '10em'
    }
});

export const CampaignLink = (props: Props) => {
    const classes = useStyles();
    return (
        <Link to={`${routes.campaign.path}${props.id}`} key={props.id} className={classes.link}>
            <Paper className={classes.paper}>
                <Typography variant="h5" gutterBottom>
                    {props.name}
                </Typography>
                <Typography variant="subtitle1">Run by {props.ownerName}</Typography>
            </Paper>
        </Link>
    );
};
