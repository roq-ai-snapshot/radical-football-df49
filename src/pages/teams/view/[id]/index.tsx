import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getTeamById } from 'apiSdk/teams';
import { Error } from 'components/error';
import { TeamInterface } from 'interfaces/team';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deletePracticePlanById } from 'apiSdk/practice-plans';
import { deleteCoachById, createCoach } from 'apiSdk/coaches';
import { deletePlayerById, createPlayer } from 'apiSdk/players';

function TeamViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TeamInterface>(
    () => (id ? `/teams/${id}` : null),
    () =>
      getTeamById(id, {
        relations: ['academy', 'practice_plan', 'coach', 'player'],
      }),
  );

  const practice_planHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePracticePlanById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [coachUserId, setCoachUserId] = useState(null);
  const coachHandleCreate = async () => {
    setCreateError(null);
    try {
      await createCoach({ team_id: id, user_id: coachUserId });
      setCoachUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const coachHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCoachById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [playerUserId, setPlayerUserId] = useState(null);
  const playerHandleCreate = async () => {
    setCreateError(null);
    try {
      await createPlayer({ team_id: id, user_id: playerUserId });
      setPlayerUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const playerHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Team Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              created_at: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              updated_at: {data?.updated_at as unknown as string}
            </Text>
            {hasAccess('academy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                academy: <Link href={`/academies/view/${data?.academy?.id}`}>{data?.academy?.name}</Link>
              </Text>
            )}
            {hasAccess('practice_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Practice Plan
                </Text>
                <Link href={`/practice-plans/create?team_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>title</Th>
                        <Th>description</Th>
                        <Th>date</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.practice_plan?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.title}</Td>
                          <Td>{record.description}</Td>
                          <Td>{record.date as unknown as string}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/practice-plans/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/practice-plans/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => practice_planHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            <>
              <Text fontSize="md" fontWeight="bold">
                Coach
              </Text>
              <UserSelect name={'coach_user'} value={coachUserId} handleChange={setCoachUserId} />
              <Button colorScheme="blue" mr="4" onClick={coachHandleCreate} isDisabled={!coachUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>created_at</Th>
                      <Th>updated_at</Th>
                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.coach?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.created_at as unknown as string}</Td>
                        <Td>{record?.user?.updated_at as unknown as string}</Td>
                        <Td>
                          <Button>
                            <Link href={`/users/view/${record?.user?.id}`}>View</Link>
                          </Button>
                        </Td>
                        <Td>
                          <Button onClick={() => coachHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>

            <>
              <Text fontSize="md" fontWeight="bold">
                Player
              </Text>
              <UserSelect name={'player_user'} value={playerUserId} handleChange={setPlayerUserId} />
              <Button colorScheme="blue" mr="4" onClick={playerHandleCreate} isDisabled={!playerUserId}>
                Create
              </Button>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>position</Th>
                      <Th>birth_date</Th>
                      <Th>created_at</Th>
                      <Th>updated_at</Th>
                      <Th>View</Th>
                      <Th>Delete</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.player?.map((record) => (
                      <Tr key={record?.user?.id}>
                        <Td>{record?.user?.position}</Td>
                        <Td>{record?.user?.birth_date as unknown as string}</Td>
                        <Td>{record?.user?.created_at as unknown as string}</Td>
                        <Td>{record?.user?.updated_at as unknown as string}</Td>
                        <Td>
                          <Button>
                            <Link href={`/users/view/${record?.user?.id}`}>View</Link>
                          </Button>
                        </Td>
                        <Td>
                          <Button onClick={() => playerHandleDelete(record.id)}>Delete</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'team',
  operation: AccessOperationEnum.READ,
})(TeamViewPage);
