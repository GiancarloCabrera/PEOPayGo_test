import { useForm } from '@/hooks/useForm';
import { useGetEmployeesByClientIdQuery } from '@/redux/api/employeeApi';
import { useCreateTimesheetMutation } from '@/redux/api/timesheetApi';
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreateTimsheetForm = ({ handleClose }: any) => {
  const [employeesNameList, setEmployeesNameList] = useState<string[]>([]);
  const [choseenEmployees, setChoseenEmployees] = useState<string[]>([]);
  const [choseenIdEmployees, setChoseenIdEmployees] = useState<string[]>([]);
  const { data: session } = useSession();
  const [createTimesheet, result] = useCreateTimesheetMutation();
  const { isLoading, isFetching, data, error } = useGetEmployeesByClientIdQuery({
    id: session?.user.user.id,
    page: 1,
    limit: 1000
  });
  const [values, handleInputChange, reset] = useForm({
    startDate: '',
    endDate: '',
    checkDate: ''
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Timesheet created!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not create timesheet...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSelectChange = (event: any) => {
    const {
      target: { value },
    } = event;
    const employeesId = value.map((val: any) => {
      if (typeof val === 'string') {
        const id = val?.match(/^\d+/)
        if (id) {
          return parseInt(id[0]);
        }
      }
      return val;
    });
    setChoseenIdEmployees(employeesId);
    setChoseenEmployees(
      typeof value === 'string' ? value.split(',') : value,
    )
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleClose();
    if (!choseenEmployees.length) {
      Swal.fire({
        icon: "error",
        title: "No employees provided...",
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      if (session) {
        const timesheet = {
          ...values,
          userId: session.user.user.id,
          employees: choseenIdEmployees
        }
        createTimesheet(timesheet)
      }
    }
  };

  const parseEmployeesList = async (list: any) => {
    if (list) {
      const employeesNames = list.employees.map((employee: any) => {
        return `${employee.id}. ${employee.name}`
      });
      setEmployeesNameList(employeesNames);
    } else {
      setEmployeesNameList([])
    }
  }

  useEffect(() => {
    parseEmployeesList(data);
  }, [data])


  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Create Timesheet</Typography>
      <TextField
        label="Start Date"
        type="date"
        value={values.startDate}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        name='startDate'
        InputLabelProps={{ shrink: true }}
        required
      />
      <TextField
        label="End Date"
        type="date"
        value={values.endDate}
        name='endDate'
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Check Date"
        type="date"
        value={values.checkDate}
        name='checkDate'
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="demo-simple-select-label">Employees</InputLabel>
        <Select
          id="demo-multiple-name"
          multiple
          fullWidth
          value={choseenEmployees}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Employees" />}
          MenuProps={MenuProps}
        >
          {employeesNameList.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box paddingY='10px' display='flex' justifyContent='flex-end' alignItems='center'>
        <Button style={{ marginRight: '10px' }} onClick={() => {
          reset()
          setChoseenEmployees([]);
        }} variant="contained" color="error">Reset</Button>
        <Button type="submit" variant="contained" color="success">Create</Button>
      </Box>
    </form>
  )
}

export default CreateTimsheetForm
