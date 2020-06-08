const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('./database');
const { ObjectID } = require('mongodb');

async function addUser(_,{name,email,password}){
  const db = getDb();
  const existingUser = await db.collection('user').findOne({email:email});
  if(existingUser){
    return "User already exists";
  }
  const salt = await bcryptjs.genSalt();
  const hash = await bcryptjs.hash(password,salt);
  let year = new Date();
  year = year.getFullYear();
  const session = {
    year: year.toString() + '-' + (year+1).toString(),
  }
  const User = {
    name,
    email,
    password:hash,
  };
  User.sessions = [];
  User.sessions.push(session);
  await db.collection('user').insertOne(User);
  return "User added";
}

async function loginUser(_,{email,password}){
  const db = getDb();
  const user = await db.collection('user').findOne({email:email});
  if(!user){
    return "enr";
  }
  const verify = await bcryptjs.compare(password,user.password);
  if(!verify){
    return "inv";
  }
  const token = jwt.sign({id:user._id},"secretpasswordforjwt");
  return JSON.stringify({
    token,
    id:user._id,
    name:user.name,
    sessions:user.sessions,
  });
}

function verifyToken(token){
  const verifiedToken = jwt.verify(token,"secretpasswordforjwt");
  return verifiedToken;
}

async function getUser(_,{token}){
  if(!token){
    return "No authentication token found";
  }
  const db = getDb();
  const verifiedToken = verifyToken(token);
  if(!verifiedToken){
    return "Invalid token, not authorized";
  }
  const id = verifiedToken.id;
  const uid = new ObjectID(id);
  const user = await db.collection('user').findOne({_id:uid});
  if(!user){
    return "User not found";
  }
  return JSON.stringify({
    name:user.name,
    id:user._id,
    sessions:user.sessions,
  });
}

async function isTokenValid(_,{token}){
  if(!token){
    return false;
  }
  const db = getDb();
  const verifiedToken = verifyToken(token);
  if(!verifiedToken){
    return false;
  }
  const id = verifiedToken.id;
  const uid = new ObjectID(id);
  const user = await db.collection('user').findOne({_id:uid});
  if(!user){
    return false;
  }
  return true;
}

module.exports = { addUser, loginUser, getUser, isTokenValid };