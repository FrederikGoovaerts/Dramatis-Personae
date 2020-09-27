import React from 'react';
import { create } from 'react-test-renderer';

import { HeaderRaw } from '../../../../src/components/molecules/header/Header';

describe('The Header', () => {
    it('should accept content', () => {
        const component = create(<HeaderRaw logout={() => undefined} leftContent={<div>The left content</div>} />);
        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should accept a custom css class for the app bar', () => {
        const component = create(<HeaderRaw logout={() => undefined} className="test-class" />);
        expect(component.toJSON()).toMatchSnapshot();
    });
});
