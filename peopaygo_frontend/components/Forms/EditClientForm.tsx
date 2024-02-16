import { useForm } from '@/hooks/useForm';
import { useEditClientMutation } from '@/redux/api/clientApi';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { FormEvent } from 'react'
import Swal from 'sweetalert2';

const EditClientForm = ({ handleClose, client }: any) => {
  const [editClient, result] = useEditClientMutation();
  const { data: session } = useSession();
  const [values, handleInputChange, reset] = useForm({
    role: client.role,
    company: client.company
  });

  if (result.isSuccess) {
    Swal.fire({
      icon: "success",
      title: "Client edited!",
      showConfirmButton: false,
      timer: 1500
    });
  } else if (result.isError) {
    Swal.fire({
      icon: "error",
      title: "Could not edit client...",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (session) {
      const updClient = {
        ...values,
        hours: values.hours ? parseInt(values.hours) : null,
        companyId: session.user.user.id,
      }
      editClient({
        id: client.id,
        client: updClient
      })
      handleClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6">Edit Client</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          label="Id"
          type="number"
          value={client.id}
          fullWidth
          margin="normal"
          name='name'
          style={{ marginRight: '10px' }}
          InputLabelProps={{ shrink: true }}
          required
          disabled
        />
        <TextField
          label="Email"
          type="email"
          value={client.email}
          fullWidth
          margin="normal"
          name='email'
          style={{ marginRight: '10px' }}
          InputLabelProps={{ shrink: true }}
          required
          disabled
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
        <Button type="submit" variant="contained" color="success">Edit</Button>
      </Box>
    </form>
  )
}

export default EditClientForm
