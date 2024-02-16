"use client"
import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminProfileCard() {
  const { data: session } = useSession();
  const email = session?.user.user?.email;
  const role = session?.user.user?.role;

  return (
    <Card sx={{ minWidth: 400, height: 350, padding: '3%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <PersonIcon />
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
        </Grid>
        <Grid container spacing={2} direction='column'>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography>{email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Role:</Typography>
            <Typography>{role}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
