import { useForm } from '@/hooks/useForm';
import { useEditEmployeeMutation } from '@/redux/api/employeeApi';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent } from 'react'
import Swal from 'sweetalert2';

const EditEmployeeForm = ({ handleClose, employee }: any) => {
  const { data: session } = useSession();
  const [editEmployee, result] = useEditEmployeeMutation();
  const [values, handleInputChange, reset] = useForm({
    name: employee.name,
    payType: employee.payType,
    hours: employee.hours || 0,
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Employee updated!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not update employee...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (session) {
      const updEmployee = {
        ...values,
        hours: values.hours ? parseInt(values.hours) : null,
        companyId: session.user.user.id,
      }
      editEmployee({ id: employee.id, employee: updEmployee })
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Edit Employee</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <TextField
          label="Id"
          type="number"
          value={employee.id}
          fullWidth
          margin="normal"
          name='name'
          style={{ marginRight: '10px' }}
          InputLabelProps={{ shrink: true }}
          required
          disabled
        />
        <TextField
          label="Pay Rate"
          type="number"
          value={employee.payRate}
          fullWidth
          margin="normal"
          name='name'
          InputLabelProps={{ shrink: true }}
          required
          disabled
        />
      </div>
      <TextField
        label="Name"
        type="text"
        value={values.name}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        name='name'
        InputLabelProps={{ shrink: true }}
        required
      />
      <FormControl required >
        <FormLabel id="demo-row-radio-buttons-group-label">Pay Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e) => handleInputChange(e)}
          value={values.payType}
        >
          <FormControlLabel name="payType" value="SALARY" control={<Radio required={true} />} label="Salary" />
          <FormControlLabel name="payType" value="HOURLY" control={<Radio required={true} />} label="Hourly" />
        </RadioGroup>
      </FormControl>
      <TextField
        disabled={values.payType === "SALARY"}
        label="Hours"
        type="number"
        value={values.hours}
        name='hours'
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        required
      />
      <Box paddingY='10px' display='flex' justifyContent='flex-end' alignItems='center'>
        <Button style={{ marginRight: '10px' }} onClick={() => {
          reset()
        }} variant="contained" color="error">Reset</Button>
        <Button type="submit" variant="contained" color="success">Edit</Button>
      </Box>
    </form>
  )
}

export default EditEmployeeForm
