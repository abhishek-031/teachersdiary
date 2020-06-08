const { ObjectID } = require('mongodb');
const { getDb } = require('./database');

async function createClass(_,{className,teacherName}){
  const uid = new ObjectID(teacherName);
  const db = getDb();
  const clss = {};
  clss.name = className;
  clss.students = [];
  const res = await db.collection('classes').insertOne(clss);
  const teacher = await db.collection('user').findOne({_id:uid});
  if(teacher.sessions[teacher.sessions.length-1].classes === undefined){
    teacher.sessions[teacher.sessions.length-1].classes = [];
  }
  teacher.sessions[teacher.sessions.length-1].classes.push(res.insertedId);
  await db.collection('user').findOneAndReplace({_id:teacher._id},teacher);
  clss._id = res.insertedId;
  return clss;
}

async function getClasses(_,{name,session}){
  const db = getDb();
  const uid = new ObjectID(name);
  const teacher = await db.collection('user').findOne({_id:uid});
  const reqSession = teacher.sessions.find(sessioni=>{
    return sessioni.year===session;
  });
  const classesID = reqSession.classes;
  if(classesID === undefined){
    return null;
  }
  const classes=[];
  for(let i=0;i<classesID.length;i++){
    const foundClass = await db.collection('classes').findOne({_id:classesID[i]});
    classes.push(foundClass);
  }
  return classes;
}

async function classname(_,{classid}){
  const db = getDb();
  const cid = new ObjectID(classid);
  const data = await db.collection('classes').findOne({_id:cid});
  return data.name;
}

module.exports = { createClass, getClasses, classname };