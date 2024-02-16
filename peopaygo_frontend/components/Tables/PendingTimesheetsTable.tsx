"use client"
import handleDate from '@/helpers/handleDate';
import { Button, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import EditPendingTimeSheetModal from '../Modals/EditPendingTimesheetModal';
import { useGetPendingTimesheetsQuery, useUpdateTimesheetStatusMutation } from '@/redux/api/timesheetApi';
import handleSignOut from '@/helpers/handleSignOut';

const PendingTimesheetsTable = () => {
  const numTimesheets = 8;
  const [actualPage, setActualPage] = useState<number>(1);
  const { isLoading, isFetching, data, error } = useGetPendingTimesheetsQuery({
    page: actualPage,
    limit: numTimesheets
  });
  const [updateTimesheetStatus, result] = useUpdateTimesheetStatusMutation();

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Timesheet status updated!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not update timesheet status...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number) => {
    setActualPage(page);
  };
  const handleAccept = async (e: React.ChangeEvent<unknown>, id: number) => {
    e.preventDefault();
    updateTimesheetStatus({ id, status: 'ACCEPTED' });
  };

  const handleDeny = async (e: React.ChangeEvent<unknown>, id: number) => {
    e.preventDefault();
    updateTimesheetStatus({ id, status: 'DENIED' });
  };


  if (isLoading || isFetching) return <p>loading...</p>;
  if (error) {
    if ('status' in error && error.status === 401) {
      handleSignOut();
    } else {
      return <p>Could not get Timesheet List...</p>
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
                        <TableCell align="center" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Button onClick={e => handleAccept(e, timesheet.id)} variant="outlined" color="success" sx={{ marginRight: '8px' }}>Accept</Button>
                          <Button onClick={e => handleDeny(e, timesheet.id)} variant="outlined" color="error" sx={{ marginRight: '8px' }}>Deny</Button>
                          <EditPendingTimeSheetModal timesheet={timesheet} />
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

export default PendingTimesheetsTable;