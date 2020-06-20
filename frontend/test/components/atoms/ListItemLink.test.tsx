import React from 'react';
import { create } from 'react-test-renderer';

import { ListItemLink } from '../../../src/components/atoms/ListItemLink';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

describe('The ListItemLink', () => {
    it('should render correctly', () => {
        const component = create(
            <Router history={createMemoryHistory()}>
                <ListItemLink to="destination">contents</ListItemLink>
            </Router>
        );
        const tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();
    });
});
