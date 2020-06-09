import React from 'react';
import graphQLFetch from '../GraphQLFetch';
import Loader from 'react-loader-spinner';

export default class CreateClass extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      classname:'',
      students:[],
    }
    this.classid = '';
  }

  handleNameSubmit(e){
    e.preventDefault();
    const form = document.forms.classForm;
    const cname = form.classname.value;
    const subject = form.subject.value.trim().toUpperCase();
    const classname = cname.trim().toUpperCase();
    this.setState({classname:classname+' '+subject});
  }

  handleStudent(e){
    e.preventDefault();
    const form = document.forms.studentAdder;
    const student = {
      name:form.studentName.value.trim().toUpperCase(),
      rollnumber:form.rollNo.value.trim().toUpperCase(),
    };
    const students = this.state.students;
    students.push(student);
    form.studentName.value='';
    form.rollNo.value='';
    this.setState({students:students});
  }

  async submitClass(){
    this.setState({
      loading:true,
    });
    let query = `mutation{
      createClass(className:"${this.state.classname}",teacherName:"${this.props.teacher}"){
        _id
      }
    }`;
    const data = await graphQLFetch(query);
    this.classid = data.createClass._id;

    this.state.students.forEach(std=>{
      std.class = this.classid;
    });

    query=`mutation addStudents($classid:ID!,$students:[StudentInput!]!){
      addStudents(classid:$classid,students:$students){
        name
      }
    }`;
    let vars = {
      students:this.state.students,
      classid:this.classid,
    };
    await graphQLFetch(query,vars);
    this.setState({
      loading:false,
    });
    this.props.doneCreating();
  }

  render(){
    let view = '';
    if(this.state.classname===''){
      view = (
        <form className='loginform' name='classForm' onSubmit={(e)=>{this.handleNameSubmit(e)}}>
          <h3>Create Class:</h3>
          <input name='classname' type='text' placeholder='Name of Class' required />
          <input name='subject' type='text' placeholder='Subject' required />
          <button type='submit'>Add Class</button>
        </form>
      )
    }
    else{
      view = (
        <>
        {this.state.loading?<Loader style={{position:"absolute", top:'50vh', left:'50vw'}} type="ThreeDots" color="#254e58" height={80} width={80} />:
        <>
          <h3 className='welcomeText'>{this.state.classname}</h3>
          <div className='addeddiv'>
          <h3>Added Students:</h3>
          <table style={{background:"#88bdbc"}}>
            <thead>
              <tr>
              <th>Roll Number</th>
              <th>Name</th>
              </tr>
            </thead>
            <tbody>
            {this.state.students.map(student=>{
              return (
                <tr key={student.rollnumber}><td>{student.rollnumber}</td><td>{student.name}</td></tr>
              );
            })}
            </tbody>
          </table>
          </div>
          <div className='stddiv'>
          <form className='studentform' name='studentAdder' onSubmit={(e)=>{this.handleStudent(e)}}>
            <h3>Add Student</h3>
            <input type='text' name='rollNo' placeholder='Roll Number' required/>
            <input type='text' name='studentName' placeholder='Student Name' required/>
            <button className='stdbtn' type='sumbit'>Add Student</button>
          </form>
          <div className='studentform'>
          <h3>Finished adding students? </h3>
          <button className='stdbtn' onClick={()=>{this.submitClass()}}>Create Class</button>
          </div>
          </div>
        </>}</>
      )
    }
    return (
    <div>
      {view}
    </div>  
    )
  }
}
