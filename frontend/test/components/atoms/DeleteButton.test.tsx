import React from 'react';
import { act, create } from 'react-test-renderer';

import { ConfirmableButton, DeleteButton } from '../../../src/components/atoms/DeleteButton';

describe('The delete button', () => {
    it('should go through three states', () => {
        const component = create(<DeleteButton onConfirm={() => undefined} />);
        let tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();

        // Click delete button once
        act(tree.props.onClick);
        tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();

        // Confirm delete
        act(tree.props.onClick);
        tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();
    });
});

describe('The confirmable button', () => {
    it('should show the supplied labels', () => {
        const component = create(
            <ConfirmableButton defaultText="the default" confirmedText="when confirmed" onConfirm={() => undefined} />
        );
        let tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();

        // Click delete button once
        act(tree.props.onClick);
        tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();

        // Confirm delete
        act(tree.props.onClick);
        tree = component.toJSON();
        if (!tree) {
            fail();
        }
        expect(tree).toMatchSnapshot();
    });
});
