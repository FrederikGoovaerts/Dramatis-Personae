import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
    to: string;
    children: React.ReactNode;
    selected?: boolean;
}

export function ListItemLink(props: Props) {
    return <ListItem selected={props.selected} button component={Link} {...props} />;
}
