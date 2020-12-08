import { AppBar, Link, Toolbar, Typography } from '@material-ui/core';
import React from 'react';

export default function TopBar(){
  return (
    <AppBar position='fixed' style={{ zIndex:1201 }} >
      <Toolbar>
        <Link href='/' style={{ color: '#fff', textDecoration: 'none' }}>
          <Typography variant='h5'>Teacher's Diary</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  )
}