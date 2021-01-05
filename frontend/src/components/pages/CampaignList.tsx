import { Button, Heading, Link, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { routes } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { ConfirmableButton } from '../atoms/ConfirmableButton';
import { Loader } from '../atoms/Loader';
import { NewCampaignForm } from '../molecules/campaign/NewCampaignForm';

export const CampaignList = () => {
    const campaigns = useSelector((state: RootState) => state.campaign.campaigns);
    const loading = useSelector((state: RootState) => state.campaign.loading);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(campaignActions.actions.fetchCampaigns());
    }, [dispatch]);

    const ownCampaigns = campaigns.filter((c) => c.owner);
    const otherCampaigns = campaigns.filter((c) => !c.owner);

    if (loading) {
        return <Loader />;
    }

    return (
        <Stack spacing={6} marginTop="2em">
            <Heading size="lg">Campaigns you run</Heading>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th fontFamily="Inter,sans-serif">Campaign name</Th>
                        <Th fontFamily="Inter,sans-serif" width="20%">
                            Actions
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {ownCampaigns.map((c) => (
                        <Tr key={c.id}>
                            <Td>
                                <Link as={RouterLink} to={`${routes.campaign.path}${c.id}`}>
                                    {c.name}
                                </Link>
                            </Td>
                            <Td>
                                <Button>Edit</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <NewCampaignForm />
            <Heading size="lg">Campaigns you play</Heading>
            <Table variant="simple" fontFamily="Inter,sans-serif">
                <Thead>
                    <Tr>
                        <Th>Campaign name</Th>
                        <Th>Run by</Th>
                        <Th width="20%">Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {otherCampaigns.map((c) => (
                        <Tr key={c.id}>
                            <Td>
                                <Link as={RouterLink} to={`${routes.campaign.path}${c.id}`}>
                                    {c.name}
                                </Link>
                            </Td>
                            <Td>{c.ownerName}</Td>
                            <Td>
                                <ConfirmableButton
                                    defaultText="Leave"
                                    onConfirm={() => dispatch(campaignActions.actions.leaveCampaign(c.id))}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Stack>
    );
};
