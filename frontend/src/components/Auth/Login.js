import React, { useContext } from 'react';
import graphQLFetch from '../../GraphQLFetch';
import UserContext from '../../UserContext';
import { useHistory } from 'react-router-dom';

export default function Login(){
  
  const history = useHistory();
  const { setUserData } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form=document.forms.login;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    const query=`query loginUser($email:String!,$password:String!){
      loginUser(email:$email,password:$password)
    }`
    const vars = {
      email,
      password,
    };
    const d = await graphQLFetch(query,vars);
    if(d.loginUser === 'enr'){
      alert('Email not registered');
      return;
    }
    if(d.loginUser === 'inv'){
      alert('Invalid Credentials');
      return;
    }
    const data = JSON.parse(d.loginUser);
    setUserData({
      token:data.token,
      user:{
        id:data.id,
        name:data.name,
        sessions:data.sessions,
      }
    });
    localStorage.setItem('auth-token',data.token);
    form.email.value='';
    form.password.value='';
    history.push(`/${data.name}`);
  }

  return (
    <form className='loginform' name='login' onSubmit={handleSubmit}>
      <h3>LOGIN</h3>
      <input type='email' placeholder='Email' name='email' required/> <br />
      <input type='password' placeholder='Password' name='password' required/> <br />
      <button type='submit'>Login</button>
      <p id='notregis'>Not registered? Click <a href='/register'>here</a> to register.</p>
    </form>
  );
}