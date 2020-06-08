const { getDb } = require('./database');
const { ObjectID } = require('mongodb');

async function createNewSession(_,{teacherName}){
  const db = getDb();
  const uid = new ObjectID(teacherName);
  const teacher = await db.collection('user').findOne({_id:uid});
  let year = new Date().getFullYear();
  const sessionString = year.toString()+'-'+(year+1).toString();
  let alreadyCreated=0;
  for(let i=0;i<teacher.sessions.length;i++){
    if(teacher.sessions[i].year===sessionString){
      alreadyCreated=1;
      break;
    }
  }
  if(alreadyCreated){
    return false;
  }
  else{
    const session = {
      year:sessionString
    };
    teacher.sessions.push(session);
    await db.collection('user').findOneAndReplace({_id:teacher._id},teacher);
    return true;
  } 
}

module.exports = { createNewSession };