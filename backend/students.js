const { ObjectID } = require('mongodb');
const { getDb } = require('./database');


async function addStudents(_,{classid,students}){
  const db = getDb();
  const addedStudents = await db.collection('students').insertMany(students);
  const studentids = Object.values(addedStudents.insertedIds);
  const cid = new ObjectID(classid);
  const classdoc = await db.collection('classes').findOne({_id:cid});
  classdoc.students = studentids;
  await db.collection('classes').findOneAndReplace({_id:cid},classdoc);
  return addedStudents.ops;
}

async function editStudent(_,{name,rollnumber,sid}){
  const id = new ObjectID(sid);
  const db = getDb();
  const std = await db.collection('students').findOne({_id:id});
  std.name=name;
  std.rollnumber = rollnumber;
  await db.collection('students').findOneAndReplace({_id:id},std);
  return true;
}


async function students(_,{classid}){
  const db = getDb();
  const stds = [];
  const cid = new ObjectID(classid);
  const doc = await db.collection('classes').findOne({_id:cid});
  const stdids = doc.students;
  for(let i=0;i<stdids.length;i++){
    const std = await db.collection('students').findOne({_id:stdids[i]});
    stds.push(std);
  }
  return stds;
}

async function markAttendance(_,{studentID,date,present}){
  const db = getDb();
  const sid = new ObjectID(studentID);
  const std = await db.collection('students').findOne({_id:sid});
  if(std.attendance===undefined){
    std.attendance = [];
  }
  const attendance = {
    date,
    present,
  };
  std.attendance.push(attendance);
  await db.collection('students').findOneAndReplace({_id:sid},std);
  return true;
}

async function student(_,{studentID}){
  const db = getDb();
  const sid = new ObjectID(studentID);
  const doc = await db.collection('students').findOne({_id:sid});
  return doc;
}

async function addMarks(_,{studentID,maxscore,score,nameofexam}){
  const db = getDb();
  const sid = new ObjectID(studentID);
  const doc = await db.collection('students').findOne({_id:sid});
  if(doc.marks===undefined){
    doc.marks = [];
  }
  const mark = {
    nameofexam,
    maxscore,
    score
  };
  doc.marks.push(mark);
  await db.collection('students').findOneAndReplace({_id:sid},doc);
  return true;
}

async function editAttendance(_,{studentID,index}){
  const db = getDb();
  const sid = new ObjectID(studentID);
  const doc = await db.collection('students').findOne({_id:sid});
  const present = doc.attendance[index].present;
  doc.attendance[index].present = !present;
  await db.collection('students').findOneAndReplace({_id:sid},doc);
  return !present;
}

async function editMarks(_,{studentID,index,marks}){
  const sid = new ObjectID(studentID);
  const db = getDb();
  const doc = await db.collection('students').findOne({_id:sid});
  doc.marks[index].score=marks;
  await db.collection('students').findOneAndReplace({_id:sid},doc);
  return marks;
}

async function addStudent(_,{classid,student}){
  const cid = new ObjectID(classid);
  const db = getDb();
  const d = await db.collection('students').insertOne(student);
  const sid = d.insertedId;
  const cdoc = await db.collection('classes').findOne({_id:cid});
  cdoc.students.push(sid);
  await db.collection('classes').findOneAndReplace({_id:cid},cdoc);
  return true; 
}

async function deleteStd(_,{studentid,classid}){
  const db = getDb();
  const sid = new ObjectID(studentid);
  const cid = new ObjectID(classid);
  await db.collection('students').deleteOne({_id:sid});
  const cdoc = await db.collection('classes').findOne({_id:cid});
  const stds = cdoc.students.filter(std=>{
    return !std.equals(sid);
  });
  cdoc.students = stds;
  await db.collection('classes').findOneAndReplace({_id:cid},cdoc);
  return true;
}

module.exports = { addStudents ,students, markAttendance, student, addMarks, editAttendance, editMarks, editStudent, addStudent, deleteStd };