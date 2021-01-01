import React from 'react';
import { create } from 'react-test-renderer';

import { ConfirmableButton, DeleteButton } from '../../../src/components-old/atoms/ConfirmableButton';

describe('The delete button', () => {
    // TODO: Add tests for different states
    it('should have the correct initial look', () => {
        const component = create(<DeleteButton onConfirm={() => undefined} />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});

describe('The confirmable button', () => {
    // TODO: Add tests for different states
    it('should have the correct initial look', () => {
        const component = create(
            <ConfirmableButton defaultText="the default" confirmedText="when confirmed" onConfirm={() => undefined} />
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
