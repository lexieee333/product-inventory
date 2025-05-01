import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: '#fff',
          borderRight: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo and app name */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 32, height: 32, background: '#fff0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Placeholder for logo icon */}
            <Typography variant="h6" color="#a31515" fontWeight="bold">8</Typography>
          </Box>
          <Typography variant="h6" color="#a31515" fontWeight="bold">8E Degrees</Typography>
        </Box>
        <List>
          <ListItem button disabled>
            <ListItemIcon><AccountBalanceIcon color="disabled" /></ListItemIcon>
            <ListItemText primary="Accounting" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/"
            selected={location.pathname === '/'}
            sx={{ backgroundColor: location.pathname === '/' ? '#a31515' : 'inherit', color: location.pathname === '/' ? '#fff' : 'inherit', borderRadius: 2, my: 1 }}
          >
            <ListItemIcon>
              <InventoryIcon sx={{ color: location.pathname === '/' ? '#fff' : '#a31515' }} />
            </ListItemIcon>
            <ListItemText primary="Product Inventory" />
          </ListItem>
          <ListItem button disabled>
            <ListItemIcon><PeopleIcon color="disabled" /></ListItemIcon>
            <ListItemText primary="Customer Management" />
          </ListItem>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <List>
          <ListItem button disabled sx={{ mb: 2 }}>
            <ListItemIcon><ExitToAppIcon color="disabled" /></ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
} 