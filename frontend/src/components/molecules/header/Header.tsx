import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import * as React from 'react';
import { connect } from 'react-redux';

import { applicationActions } from '../../../store/actions';
import { PersonaeNoCircleIcon } from '../../../assets/svg/PersonaeNoCircleIcon';
import { Box, makeStyles } from '@material-ui/core';

interface Props {
    className?: string;
    leftContent?: JSX.Element;
    logout: () => void;
}

const useStyles = makeStyles({
    icon: {
        marginRight: '1em'
    },
    content: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between'
    },
    side: {
        display: 'flex'
    }
});

export const HeaderRaw = (props: Props) => {
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={props.className}>
            <Toolbar>
                <Box className={classes.content}>
                    {props.leftContent || (
                        <Box className={classes.side}>
                            <PersonaeNoCircleIcon
                                className={classes.icon}
                                width={'2em'}
                                height={'2em'}
                                fill={'#ffffff'}
                            />
                            <Typography variant="h6" color="inherit">
                                Dramatis Personae
                            </Typography>
                        </Box>
                    )}

                    <Box className={classes.side}>
                        <Button variant="contained" color="primary" onClick={props.logout}>
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export const Header = connect(null, { logout: applicationActions.actions.logout })(HeaderRaw);
