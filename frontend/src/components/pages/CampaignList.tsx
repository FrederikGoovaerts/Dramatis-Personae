import { Button, Fade, Heading, Stack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { campaignRoute } from '../../config/constants';
import { campaignActions } from '../../store/actions';
import { RootState } from '../../store/reducers';
import { Campaign } from '../../types/campaign.types';
import { ConfirmableButton } from '../atoms/ConfirmableButton';
import { NewCampaignForm } from '../molecules/CampaignNewForm';
import { CampaignEditDrawer } from '../organisms/CampaignEditDrawer';

export const CampaignList = () => {
    const dispatch = useDispatch();
    const [editCampaign, setEditCampaign] = useState<Campaign | undefined>(undefined);

    const campaigns = useSelector((state: RootState) => state.campaign.campaigns);
    const loading = useSelector((state: RootState) => state.campaign.loading);

    useEffect(() => {
        dispatch(campaignActions.actions.fetchCampaigns());
    }, [dispatch]);

    const ownCampaigns = campaigns.filter((c) => c.owner);
    const otherCampaigns = campaigns.filter((c) => !c.owner);

    const del = (id: string) => dispatch(campaignActions.actions.deleteCampaign(id));
    const edit = (id: string, name: string) => dispatch(campaignActions.actions.editCampaign({ id, name }));

    if (loading) {
        return <></>;
    }

    return (
        <>
            <Fade in={true}>
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
                                        <Link to={campaignRoute(c.id)}>{c.name}</Link>
                                    </Td>
                                    <Td>
                                        <Button onClick={() => setEditCampaign(c)}>Edit and info</Button>
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
                                        <Link to={campaignRoute(c.id)}>{c.name}</Link>
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
            </Fade>
            <CampaignEditDrawer
                campaign={editCampaign}
                onEdit={edit}
                onDelete={del}
                onClose={() => setEditCampaign(undefined)}
            />
        </>
    );
};
