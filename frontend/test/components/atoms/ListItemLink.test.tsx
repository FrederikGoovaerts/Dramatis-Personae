import React from 'react';
import renderer from 'react-test-renderer';

import { ListItemLink } from '../../../src/components/atoms/ListItemLink';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

test('The ListItemLink should render correctly', () => {
    const component = renderer.create(
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
