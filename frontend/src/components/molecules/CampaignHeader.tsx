import * as React from 'react';
import { routes } from '../../config/constants';
import { ReturningHeader } from './ReturningHeader';

export const CampaignHeader = () => <ReturningHeader returnRoute={routes.root} returnLabel="Back to campaign list" />;
