import { Button, Drawer, Grid, makeStyles, Toolbar } from '@material-ui/core';
import React from 'react';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ExitToApp from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles({
  sideDrawer: {
    width: 200,
    flexShrink:0
  },
  drawerPaper:{
    width:200,
    background: '#172b4d'
  },
  actions:{
    color:'#8B95A6',
    width: '100%',
    '&:hover':{
      color:'#efefef',
      background: 'rgba(0,0,0,0.3)'
    }
  },
  sessions:{
    maxHeight: '30vh',
    overflowY: 'auto',
    color: '#8B95A6',
    width: '100%',
    flexGrow: 0,
  },
  container:{
    height:'100%'
  }
})

export default function SideBar(){
  
  const classes = useStyles();
  const [ sessionsOpen, setSessionsOpen ] = React.useState(false);
  const sessions = ['2018-2019','2019-2020','2020-2021'];

  return (
    <Drawer 
      variant='permanent'
      className={classes.sideDrawer}
      classes={{
        paper:classes.drawerPaper
      }}
    >
      <Toolbar />
      <Grid className={classes.container} container justify='space-evenly'>
        <Grid className={classes.sessions} item>
          <Button className={classes.actions} onClick={()=>setSessionsOpen(!sessionsOpen)} >
            Sessions
            {
              sessionsOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />
            }
          </Button>
        </Grid>
        <Grid item container className={classes.sessions}>
          {
            sessionsOpen && sessions.map(session => (
              <Button className={classes.actions}>{session}</Button>
            ))
          }
        </Grid>
        <Grid className={classes.sessions} item>
          <Button className={classes.actions}>+ new session</Button>
        </Grid>
        <Grid className={classes.sessions} item>
          <Button className={classes.actions}><ExitToApp /> Logout</Button>
        </Grid>
      </Grid>
    </Drawer>
  )
}