import handleDate from '@/helpers/handleDate';
import { useForm } from '@/hooks/useForm';
import { useGetEmployeesByClientIdQuery } from '@/redux/api/employeeApi';
import { useUpdateTimesheetMutation } from '@/redux/api/timesheetApi';
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

const EditTimsheetForm = ({ timesheet, handleClose }: any) => {

  const [employeesNameList, setEmployeesNameList] = useState<string[]>([]);
  const [choseenEmployees, setChoseenEmployees] = useState<string[]>([]);
  const [choseenIdEmployees, setChoseenIdEmployees] = useState<string[]>([]);
  const { data: session } = useSession();
  const [updTimesheet, result] = useUpdateTimesheetMutation();
  const { isLoading, isFetching, data, error } = useGetEmployeesByClientIdQuery({
    id: session?.user.user.id,
    page: 1,
    limit: 1000
  });
  const [values, handleInputChange, reset] = useForm({
    startDate: timesheet.startDate,
    endDate: timesheet.endDate,
    checkDate: timesheet.checkDate
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Timesheet edited!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not edit timesheet...",
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
        const newTimesheet = {
          ...values,
          employees: choseenIdEmployees
        }
        updTimesheet({ id: timesheet.id, timesheet: newTimesheet })
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
      <Typography variant="h6">Edit Timesheet</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          disabled
          fullWidth
          label="Id"
          type="number"
          value={timesheet.id}
          margin="normal"
          style={{ marginRight: 10 }}
          name='id'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          disabled
          fullWidth
          label="Status"
          type="text"
          value={timesheet.status}
          margin="normal"
          style={{ marginRight: 10 }}
          name='status'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          disabled
          fullWidth
          label="Total Gross Pay"
          type="number"
          value={timesheet.totalGrossPay}
          margin="normal"
          name='totalGrossPay'
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>
      <TextField
        disabled
        label="Notes"
        type="text"
        value={timesheet.notes}
        fullWidth
        margin="normal"
        name='notes'
        InputLabelProps={{ shrink: true }}
        required
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          disabled
          fullWidth
          label="Created Date"
          type="text"
          value={handleDate(timesheet.createdAt)}
          margin="normal"
          style={{ marginRight: 10 }}
          name='createdAt'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          disabled
          fullWidth
          style={{ marginRight: 10 }}
          label="Updated Date"
          type="text"
          value={handleDate(timesheet.updated_at)}
          margin="normal"
          name='updated_at'
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Start Date"
          type="date"
          fullWidth
          value={values.startDate}
          onChange={(e) => handleInputChange(e)}
          margin="normal"
          name='startDate'
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="End Date"
          type="date"
          value={values.endDate}
          name='endDate'
          style={{ marginRight: 10 }}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleInputChange(e)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Check Date"
          type="date"
          value={values.checkDate}
          name='checkDate'
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleInputChange(e)}
          margin="normal"
          required
        // sx={{
        //   svg: { color, backgroundColor: color },
        //   input: { color, backgroundColor: color },
        //   label: { color, backgroundColor: color },

        // }}
        />
      </div>
      <FormControl fullWidth>
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
        <Button type="submit" variant="contained" color="success">Edit</Button>
      </Box>
    </form>
  )
}

export default EditTimsheetForm
