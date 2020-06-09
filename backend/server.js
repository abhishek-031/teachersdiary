require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const path=require('path');
const { connect } = require('./database');
const { createNewSession } = require('./session');
const { createClass, getClasses, classname, deleteClass } = require('./classes');
const { addStudents ,students, markAttendance, student, addMarks, editAttendance, editMarks, editStudent, addStudent, deleteStd } = require('./students');
const { addUser, loginUser, getUser, isTokenValid } = require('./User');

const resolvers={
  Query:{
    classes:getClasses,
    students:students,
    classname:classname,
    student:student,
    loginUser:loginUser,
    getUser:getUser,
    isTokenValid:isTokenValid,
  },
  Mutation:{
    deleteStd:deleteStd,
    deleteClass:deleteClass,
    addStudent:addStudent,
    editStudent:editStudent,
    createNewSession:createNewSession,
    createClass:createClass,
    addStudents:addStudents,
    markAttendance:markAttendance,
    addMarks:addMarks,
    editAttendance:editAttendance,
    editMarks:editMarks,
    addUser:addUser
  }
}

const server = new ApolloServer({
  typeDefs:fs.readFileSync('schema.graphql','utf-8'),
  resolvers,
});

const app = express();
app.use(express.static(path.join(__dirname,'../frontend/build')));

server.applyMiddleware({app,path:'/graphql'});

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
})

const PORT = process.env.PORT || 3000;

(async function(){
  try{
    await connect();
    app.listen(PORT,()=>{
      console.log("api listening on port",PORT);
    })
  }
  catch(e){
    console.log(e);
  }
})();
