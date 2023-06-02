import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getPracticePlanById } from 'apiSdk/practice-plans';
import { Error } from 'components/error';
import { PracticePlanInterface } from 'interfaces/practice-plan';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteAttendanceById } from 'apiSdk/attendances';
import { deletePerformanceById } from 'apiSdk/performances';

function PracticePlanViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PracticePlanInterface>(
    () => (id ? `/practice-plans/${id}` : null),
    () =>
      getPracticePlanById(id, {
        relations: ['coach', 'team', 'attendance', 'performance'],
      }),
  );

  const attendanceHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAttendanceById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const performanceHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePerformanceById(id);
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
        Practice Plan Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              title: {data?.title}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              description: {data?.description}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              date: {data?.date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              created_at: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              updated_at: {data?.updated_at as unknown as string}
            </Text>
            {hasAccess('coach', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                coach: <Link href={`/coaches/view/${data?.coach?.id}`}>{data?.coach?.user_id}</Link>
              </Text>
            )}
            {hasAccess('team', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                team: <Link href={`/teams/view/${data?.team?.id}`}>{data?.team?.name}</Link>
              </Text>
            )}
            {hasAccess('attendance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Attendance
                </Text>
                <Link href={`/attendances/create?practice_plan_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>attended</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.attendance?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.attended}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/attendances/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/attendances/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => attendanceHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}

            {hasAccess('performance', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Performance
                </Text>
                <Link href={`/performances/create?practice_plan_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>rating</Th>
                        <Th>feedback</Th>
                        <Th>created_at</Th>
                        <Th>updated_at</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.performance?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.rating}</Td>
                          <Td>{record.feedback}</Td>
                          <Td>{record.created_at as unknown as string}</Td>
                          <Td>{record.updated_at as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/performances/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/performances/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => performanceHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'practice_plan',
  operation: AccessOperationEnum.READ,
})(PracticePlanViewPage);
