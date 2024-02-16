"use client"
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Swal from 'sweetalert2';


const paperStyle = { padding: 20, height: '35vh', width: 350, margin: "20px auto" }
const btnstyle = { margin: '8px 0' }

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const result = await signIn(
        'credentials', {
        redirect: false,
        email,
        password,
      },
      );

      if (result?.ok) {
        Swal.fire({
          icon: "success",
          title: "Logged in",
          showConfirmButton: false,
          timer: 1500
        });
        router.push('/home')
      }
      if (result?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Credentials not found...",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid display='flex' justifyContent='center' alignItems='center' flexDirection='row' textAlign='center' marginBottom='10px'>
          <PersonIcon fontSize="large" />
          <Typography variant='h4'>Sign In</Typography>
        </Grid>
        <form onSubmit={handleSubmit} style={{ height: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
          <Box>
            <TextField name='email' label='Email' placeholder='Enter username' variant="outlined" fullWidth required onChange={(e) => setEmail(e.target.value)} margin='normal' />
            <TextField name='password' label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required onChange={(e) => setPassword(e.target.value)} />
          </Box>
          <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
        </form>
        {/* <Typography >
          <Link href="#" >
            Forgot password ?
          </Link>
        </Typography>
        <Typography > Do you have an account ?
          <Link href="#" >
            Sign Up
          </Link>
        </Typography> */}
      </Paper>
    </Grid>
  );
};

export default LoginForm;
