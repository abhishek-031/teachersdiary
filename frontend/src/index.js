import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import UserContext from './UserContext';
import graphQLFetch from './GraphQLFetch';
import Header from './components/Header';
import 'whatwg-fetch';
import Sessions from './components/Sessions.js';
import Classes from './components/Classes.js';
import Students from './components/Students';
import Student from './components/Student';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';


const Element = ()=> {
  
  const [ userData , setUserData ] = useState({
    token:undefined,
    user :undefined,
  });

  let route ='';

  useEffect(()=>{
    const checkLoggedIn = async ()=>{
      let token = localStorage.getItem('auth-token');
      if(token===null){
        localStorage.setItem('auth-token','');
        token='';
      }
      const query = `query isTokenValid($token:String!){
        isTokenValid(token:$token)
      }`;
      const vars = { token };
      let loggedIn = await graphQLFetch(query,vars);
      loggedIn = loggedIn.isTokenValid;
      if(loggedIn){
        const q = `query getUser($token:String!){
          getUser(token:$token)
        }`;
        const vars = { token };
        const d = await graphQLFetch(q,vars);
        const user = JSON.parse(d.getUser);
        setUserData({
          user,
          token,
        });
      }
    }

    checkLoggedIn();
  },[]);

  if(userData.user){
    route = <Redirect exact from='/' to={`/${userData.user.name}`} />;
  }
  else{
    route = <Redirect from='/' to='/login' />
  }

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Header />
        <Switch>
          {userData.user? <Redirect exact from='/login' to='/' />:""}
          {userData.user? <Redirect exact from='/register' to='/' />:""}
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          {route}
          <Route path='/student/:studentid' component={Student} />
          <Route path='/:teacher/:session/:class' component={Students} />
          <Route path='/:teacher/:session' component={Classes} />
          <Route path='/:teacher' component={Sessions} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

ReactDOM.render(<Element />,document.getElementById('content'));