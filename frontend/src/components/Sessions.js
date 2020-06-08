import React, { useContext } from 'react';
import graphQLFetch from '../GraphQLFetch.js';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Sessions(){

  const { userData, setUserData } = useContext(UserContext); 

  const createNewSession = async ()=>{
    const query=`mutation createNewSession($teacher:String!){
      createNewSession(teacherName:$teacher)
    }`;
    const variables = {
      teacher:userData.user.id,
    };
    const data = await graphQLFetch(query,variables);
    if(data.createNewSession){
      const sessions = userData.user.sessions;
      let year = new Date().getFullYear();
      const sessionString = year.toString()+'-'+(year+1).toString();
      sessions.push({
        year:sessionString,
      });
      const user = userData.user;
      user.sessions = sessions;
      setUserData({
        user:user
      });
    }
    else{
      alert("current session already created");
    }
  }


  return (
    <>
    <h3 className='welcomeText'>WELCOME {userData.user.name} </h3>
    <div className='container'>
      {userData.user.sessions.map(session => {
        return ( <div className='linkContainer' key={session.year}><Link className='linkBox' to={`/${userData.user.name}/${session.year}`}> SESSION {session.year} </Link> </div> )
      })}
      <button className='btn' onClick={()=>{createNewSession()}}>Create New Session</button>
    </div>
    </>
  );
}