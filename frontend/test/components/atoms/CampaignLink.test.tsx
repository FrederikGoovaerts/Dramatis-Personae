import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { create } from 'react-test-renderer';

import { CampaignLink } from '../../../src/components/atoms/CampaignLink';

describe('The ListItemLink', () => {
    it('should render correctly', () => {
        const component = create(
            <Router history={createMemoryHistory()}>
                <CampaignLink id="campaignId" name="The campaign name" ownerName="Name of Owner" />
            </Router>
        );
        expect(component.toJSON()).toMatchSnapshot();
    });
});
