import { useForm } from '@/hooks/useForm';
import { useCreateClientMutation } from '@/redux/api/clientApi';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent } from 'react'
import Swal from 'sweetalert2';

const CreateClientForm = ({ handleClose }: any) => {
  const [createClient, result] = useCreateClientMutation();
  const { data: session } = useSession();
  const [values, handleInputChange, reset] = useForm({
    email: '',
    password: '',
    role: '',
    company: ''
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Client created!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not create client...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session) {
      const newClient = {
        ...values,
        hours: values.hours ? parseInt(values.hours) : null,
        companyId: session.user.user.id,
      }
      createClient(newClient)
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Create Client</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          label="Email"
          type="email"
          value={values.email}
          fullWidth
          margin="normal"
          name='email'
          onChange={(e) => handleInputChange(e)}
          style={{ marginRight: '10px' }}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={values.password}
          fullWidth
          margin="normal"
          name='password'
          onChange={(e) => handleInputChange(e)}
          style={{ marginRight: '10px' }}
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>

      <FormControl required >
        <FormLabel id="demo-row-radio-buttons-group-label">Pay Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e) => handleInputChange(e)}
          value={values.role}
        >
          <FormControlLabel name="role" value="ADMIN" control={<Radio required={true} />} label="Admin" />
          <FormControlLabel name="role" value="CLIENT" control={<Radio required={true} />} label="Client" />
        </RadioGroup>
      </FormControl>
      <TextField
        disabled={values.role === "ADMIN"}
        label="Company"
        type="text"
        value={values.company}
        onChange={(e) => handleInputChange(e)}
        fullWidth
        margin="normal"
        name='company'
        InputLabelProps={{ shrink: true }}
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

export default CreateClientForm
