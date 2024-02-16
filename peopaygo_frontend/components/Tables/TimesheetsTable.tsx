"use client"
import handleDate from '@/helpers/handleDate';
import { fetchTimesheetsByClientId } from '@/pages/api/timesheets';
import { Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import EditTimeSheetModal from '../Modals/EditTimesheetModal';
import { useGetTimesheetsByClientIdQuery } from '@/redux/api/timesheetApi';
import handleSignOut from '@/helpers/handleSignOut';

const TimesheetsTable = () => {
  const numEmployees = 8;
  const { data: session } = useSession();
  const [actualPage, setActualPage] = useState<number>(1);
  const { isLoading, isFetching, data, error } = useGetTimesheetsByClientIdQuery({
    id: session?.user.user.id,
    page: actualPage,
    limit: numEmployees
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setActualPage(page);
  };

  if (isLoading || isFetching) return <p>loading...</p>;
  if (error) {
    if ('status' in error && error.status === 401) {
      handleSignOut();
    } else {
      return <p>Could not get Timesheets List...</p>
    }
  } else {
    return (
      <div>
        {data?.foundTimesheets ?
          <React.Fragment>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 850 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="left">Check Date</TableCell>
                    <TableCell align="center">Start Date</TableCell>
                    <TableCell align="center">End Date</TableCell>
                    <TableCell align="center">Total Gross Pay</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Notes</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Updated At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    data?.foundTimesheets.map((timesheet: any) => (
                      <TableRow
                        key={timesheet.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">{timesheet.id}</TableCell>
                        <TableCell align="center">{timesheet.checkDate}</TableCell>
                        <TableCell align="center">{timesheet.startDate}</TableCell>
                        <TableCell align="center">{timesheet.endDate}</TableCell>
                        <TableCell align="center">{timesheet.totalGrossPay}</TableCell>
                        <TableCell align="center">{timesheet.status}</TableCell>
                        <TableCell align="left" sx={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{timesheet.notes}</TableCell>
                        <TableCell align="center">{handleDate(timesheet.createdAt)}</TableCell>
                        <TableCell align="center">{handleDate(timesheet.updated_at)}</TableCell>
                        <TableCell align="center">
                          <EditTimeSheetModal timesheet={timesheet} />
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
          : <p>Timesheets not found</p>
        }
      </div>
    )
  }
}

export default TimesheetsTable;