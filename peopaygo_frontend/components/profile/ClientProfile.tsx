"use client"
import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import PersonIcon from '@mui/icons-material/Person';

export default function ClientProfileCard() {
  const { data: session } = useSession();
  const company = session?.user.user?.company;
  const email = session?.user.user?.email;
  const role = session?.user.user?.role;

  return (
    <Card sx={{ maxWidth: 400, height: 350, padding: '3%' }}>
      <CardContent>
        <Grid container spacing={2}>
          <PersonIcon />
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Company:</Typography>
            <Typography>{company}</Typography>
          </Grid>
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
