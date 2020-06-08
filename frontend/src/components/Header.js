import React, { useContext }  from 'react';
import UserContext from '../UserContext';
import { Link, useHistory } from 'react-router-dom';


export default function Header(){
  
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const logout = () =>{
    setUserData({
      user:undefined,
      token:undefined,
    });
    localStorage.setItem('auth-token','');
    history.push('/');
  }
  const login = ()=>{ history.push('/login') }
  const register = ()=>{ history.push('/register') }

  return (
    <header>
      <nav>
        <Link className='title' to='/'>Teacher's Diary</Link>
        {
          userData.user?
          (
            <button id='logout' onClick={logout}>Logout</button>
          ):
          (
            <div>
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
            </div>
          )
        }
      </nav>
    </header>
  );
}