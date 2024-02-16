import React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

export default function AppBarPriv({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {children}
        </Toolbar>
      </AppBar>
    </Stack>
  );
}
