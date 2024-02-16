import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ROLES } from '@/types/roles';
import AppBarPriv from './AppBar';
import { Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import handleSignOut from '@/helpers/handleSignOut';

interface Item {
  id: number;
  name: string;
  icon: ReactNode;
  route: string
}
const client: Item[] = [
  {
    id: Math.random(),
    name: 'Employees',
    icon: <PersonIcon />,
    route: '/home/client/employees'
  },
  {
    id: Math.random(),
    name: 'Timesheet',
    icon: <NoteIcon />,
    route: '/home/client/timesheets'
  }
]

const admin: Item[] = [
  {
    id: Math.random(),
    name: 'Recieved Timesheets',
    icon: <NoteIcon />,
    route: '/home/admin/timesheets'
  },
  {
    id: Math.random(),
    name: 'Clients',
    icon: <PersonIcon />,
    route: '/home/admin/clients'
  }
]

export default function Navigation({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [items, setItems] = useState<Item[]>();
  const [user, setUser] = useState<any>();
  const { data: session, status } = useSession();

  const common: Item[] = [
    {
      id: Math.random(),
      name: 'Profile',
      icon: <AccountCircleIcon />,
      route: session?.user.user.role === ROLES.ADMIN ? '/home/admin/profile' : '/home/client/profile'
    },
    {
      id: Math.random(),
      name: 'Settings',
      icon: <SettingsIcon />,
      route: session?.user.user.role === ROLES.ADMIN ? '/home/admin/settings' : '/home/client/settings'

    }
  ]

  useEffect(() => {
    if (session?.user.user.role === ROLES.ADMIN) {
      setItems(admin);
    } else if (session?.user.user.role === ROLES.CLIENT) {
      setItems(client);
    }
    setUser(session?.user.user);
  }, [])

  const toggleDrawer =
    (anchor: string, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: string) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {items?.map((item: Item) => (
          <Link href={item.route} key={item.id}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {common.map((item: Item, index: number) => (
          <Link href={item.route} key={item.id}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment key={'left'}>
      <AppBarPriv>
        <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' flexDirection='row'>
          <Box width='fit-content' display='flex' justifyContent='left' alignItems='center' flexDirection='row'>
            <IconButton onClick={toggleDrawer('left', true)} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <p>{user?.email}</p>
          </Box>
          <Box width='fit-content' display='flex' justifyContent='space-between' alignItems='center' flexDirection='row'>
            <p>{user?.company}</p>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ExitToAppIcon />}
              onClick={handleSignOut}
              style={{ marginLeft: '20px' }}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </AppBarPriv>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        {children}
      </div>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
    </React.Fragment>
  );
}
