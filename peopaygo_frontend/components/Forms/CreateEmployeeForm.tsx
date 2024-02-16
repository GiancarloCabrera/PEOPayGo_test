import { useForm } from '@/hooks/useForm';
import { useCreateEmployeeMutation } from '@/redux/api/employeeApi';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent } from 'react'
import Swal from 'sweetalert2';


const CreateEmployeeForm = ({ handleClose }: any) => {
  const { data: session } = useSession();
  const [createEmployee, result] = useCreateEmployeeMutation()
  const [values, handleInputChange, reset] = useForm({
    name: "",
    payType: "",
    hours: 0,
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Employee created!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not create employee...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (session) {
      const employee = {
        ...values,
        hours: values.hours ? parseInt(values.hours) : null,
        companyId: session.user.user.id,
      }
      createEmployee(employee)
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Create Timesheet</Typography>
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
        <Button type="submit" variant="contained" color="success">Create</Button>
      </Box>
    </form>
  )
}

export default CreateEmployeeForm
