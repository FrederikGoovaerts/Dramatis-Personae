import React from 'react';
import { DeleteButton, ConfirmableButton } from '../../../src/components/atoms/DeleteButton';
import { create, act } from 'react-test-renderer';

test('The delete button should go through three states', () => {
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

test('The confirmable button should show the supplied labels', () => {
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
