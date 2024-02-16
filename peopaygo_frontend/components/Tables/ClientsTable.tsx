"use client"
import { Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import EditClientModal from '../Modals/EditClientModal';
import { useGetAllClientsQuery } from '@/redux/api/clientApi';
import handleSignOut from '@/helpers/handleSignOut';

const ClientsTable = () => {
  const [actualPage, setActualPage] = useState<number>(1);
  const { isLoading, isFetching, data, error } = useGetAllClientsQuery({
    page: actualPage,
    limit: 10
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setActualPage(page);
  };

  if (isLoading || isFetching) return <p>loading...</p>;
  if (error) {
    if ('status' in error && error.status === 401) {
      handleSignOut();
    } else {
      return <p>Could not get Clients List...</p>
    }
  } else {
    return (
      <div>
        {data?.clients ?
          <React.Fragment>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 850 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="center">Role</TableCell>
                    <TableCell align="center">Company</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    data?.clients.map((client: any) => (
                      <TableRow
                        key={client.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" align='left'>{client.email}</TableCell>
                        <TableCell align="center">{client.role}</TableCell>
                        <TableCell align="center">{client.company}</TableCell>
                        <TableCell align="center">
                          <EditClientModal client={client} />
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginTop={3}
            >
              <Pagination onChange={handlePageChange} page={actualPage} count={data.totalPages} color="secondary" disabled={!data?.foundTimesheets} />
            </Stack >
          </React.Fragment>
          : <p>Clients not found</p>
        }
      </div>
    )
  }
}

export default ClientsTable;