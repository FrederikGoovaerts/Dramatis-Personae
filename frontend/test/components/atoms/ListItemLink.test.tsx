import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { create } from 'react-test-renderer';

import { ListItemLink } from '../../../src/components/atoms/ListItemLink';

describe('The ListItemLink', () => {
    it('should render correctly', () => {
        const component = create(
            <Router history={createMemoryHistory()}>
                <ListItemLink to="destination">contents</ListItemLink>
            </Router>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
