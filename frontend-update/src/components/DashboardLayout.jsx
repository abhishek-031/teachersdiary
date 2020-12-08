import React from 'react';
import SideBar from './SideBar';
import TopBar from './TopBar';

export default function DashboardLayout({children}){
  return (
    <div>
      <TopBar />
      <SideBar />
      <div style={{margin:'70px 0 0 200px'}}>
        {children}
      </div>
    </div>
  )
}