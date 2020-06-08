import React, { useContext } from 'react';
import graphQLFetch from '../../GraphQLFetch';
import UserContext from '../../UserContext';
import { useHistory } from 'react-router-dom';

export default function Register(){

  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form=document.forms.register;
    let name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confPassword = form.confPassword.value.trim();
    if(name.length<3){
      alert("Name must be atleast 3 characters");
      return;
    }
    if(password.length<6){
      alert("Password must be 6 charcters long");
      return;
    }
    if(password !== confPassword){
      alert("Passwords do not match");
      return;
    }
    name = name.toUpperCase();
    const query=`mutation addUser($name:String!,$email:String!,$password:String!){
      addUser(name:$name,email:$email,password:$password)
    }`
    const vars = {
      name,
      email,
      password,
    };
    const d = await graphQLFetch(query,vars);
    if(d.addUser === 'User already exists'){
      alert('User already exists');
      return;
    }

    const q=`query loginUser($email:String!,$password:String!){
      loginUser(email:$email,password:$password)
    }`
    const vrs = {
      email,
      password,
    };
    const loginData = await graphQLFetch(q,vrs);
    const data = JSON.parse(loginData.loginUser);
    setUserData({
      token:data.token,
      user:{
        id:data.id,
        name:data.name,
        sessions:data.sessions,
      }
    });
    localStorage.setItem('auth-token',data.token);
    history.push(`/${data.name}`);
  }

  return (
    <form className='loginform' name='register' onSubmit={handleSubmit}>
      <h3>REGISTER</h3>
      <input type='text' placeholder='Name' name='name' required/> <br />
      <input type='email' placeholder='Email' name='email' required /> <br />
      <input type='password' placeholder='password' name='password' required  /> <br />
      <input type='password' placeholder='Confirm Password' name='confPassword' required /> <br/>
      <button type='submit'>Register</button>
      <p id='alreadyregis'>Already registered? Click <a href='/login'>here</a> to login.</p>
    </form>
  );
}