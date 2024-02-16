"use client"
import handleDate from '@/helpers/handleDate';
import { Button, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import EditEmployeeModal from '../Modals/EditEmployeeModal';
import { useDeleteEmployeeMutation, useGetEmployeesByClientIdQuery } from '@/redux/api/employeeApi';
import handleSignOut from '@/helpers/handleSignOut';
import { useAppDispatch } from '@/hooks/redux';

const EmployeesTable = () => {
  const numEmployees = 8;
  const { data: session } = useSession();
  const [actualPage, setActualPage] = useState<number>(1);
  const [deleteEmployee, result] = useDeleteEmployeeMutation();
  const { isLoading, isFetching, data, error } = useGetEmployeesByClientIdQuery({
    id: session?.user.user.id,
    page: actualPage,
    limit: numEmployees
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Employee deleted!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not delete employee...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setActualPage(page);
  };

  const handleDelete = async (event: React.ChangeEvent<unknown>, id: number) => {
    event.preventDefault()
    deleteEmployee({ id });
  }

  if (isLoading || isFetching) return <p>loading...</p>;
  if (error) {
    if ('status' in error && error.status === 401) {
      handleSignOut();
    } else {
      return <p>Could not get Employees List...</p>
    }
  } else {
    return (
      <div>
        {data?.employees ?
          <React.Fragment>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 850 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Pay Type</TableCell>
                    <TableCell align="center">Pay Rate</TableCell>
                    <TableCell align="center">Hours</TableCell>
                    <TableCell align="center">Created At</TableCell>
                    <TableCell align="center">Updated At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    data?.employees.map((employee: any) => (
                      <TableRow
                        key={employee.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">{employee.id}</TableCell>
                        <TableCell align="left" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.name}</TableCell>
                        <TableCell align="center">{employee.payType}</TableCell>
                        <TableCell align="center">{employee.payRate}</TableCell>
                        <TableCell align="center">{employee.hours}</TableCell>
                        <TableCell align="center">{handleDate(employee.createdAt)}</TableCell>
                        <TableCell align="center">{handleDate(employee.updated_at)}</TableCell>
                        <TableCell align="center" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <EditEmployeeModal employee={employee} />
                          <Button variant="outlined" color="error" onClick={e => handleDelete(e, employee.id)}>Delete</Button>
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
              <Pagination onChange={handlePageChange} page={actualPage} count={data.totalPages} color="secondary" disabled={!data?.employees} />
            </Stack >
          </React.Fragment>
          : <p>Employees not found</p>
        }
      </div>
    )
  }
}

export default EmployeesTable