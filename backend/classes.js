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

async function deleteClass(_,{classid,teacherid}){
  const db = getDb();
  const cid = new ObjectID(classid);
  const uid = new ObjectID(teacherid);
  const c = await db.collection('classes').findOne({_id:cid});
  await db.collection('classes').deleteOne({_id:cid});
  for(let i=0;i<c.students.length;i++){
    await db.collection('students').deleteOne({_id:c.students[i]});
  }
  const user = await db.collection('user').findOne({_id:uid});
  const classes = user.sessions[user.sessions.length-1].classes;
  const updatedc = classes.filter(classi=>{
    return !classi.equals(cid);
  });
  user.sessions[user.sessions.length-1].classes=updatedc;
  await db.collection('user').findOneAndReplace({_id:uid},user);
  return true;
}

module.exports = { createClass, getClasses, classname, deleteClass };