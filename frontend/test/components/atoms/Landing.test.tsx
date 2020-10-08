import React from 'react';
import { create } from 'react-test-renderer';

import { Landing } from '../../../src/components/atoms/Landing';

describe('The Landing', () => {
    it('should render correctly', () => {
        const component = create(<Landing />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
