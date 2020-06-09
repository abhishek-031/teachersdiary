import React from 'react';
import graphQLFetch from '../GraphQLFetch';
import StudentDetails from './StudentDetails';
import Attendance from './Attendance';
import Marks from './Marks';
import Loader from 'react-loader-spinner';
import UserContext from '../UserContext';


const AddStudent = (props)=>{


  const handleSubmit= async (e)=>{
    e.preventDefault();
    document.getElementById('addstd').disable = true;
    const form = document.forms.stddetails;
    const name = form.name.value.trim().toUpperCase();
    const rollnumber = form.rollnumber.value.trim().toUpperCase();
    const std = {
      name,
      rollnumber,
      class:props.classid,
    };
    if(props.sample){
    if(props.sample.attendance){
      std.attendance = [];
      props.sample.attendance.forEach(attd=>{
        const att = {
          date:attd.date,
          present:false,
        };
        std.attendance.push(att);
      });
    }
    if(props.sample.marks){
      std.marks=[];
      props.sample.marks.forEach(mark=>{
        const mar = {
          nameofexam:mark.nameofexam,
          score:0,
          maxscore:mark.maxscore,
        };
        std.marks.push(mar);
      });
    }
  }
    const query= `mutation addStudent($student:StudentInput!,$classid:ID!){
      addStudent(student:$student,classid:$classid)
    }`;
    const vars={
      classid:props.classid,
      student:std,
    };
    await graphQLFetch(query,vars);
    props.loadData();
    props.handleBack();
  }

  return (
    <form style={{marginTop:10}} className='loginform' name='stddetails' onSubmit={handleSubmit}>
      <h3>Add Student</h3>
      <input name='rollnumber' type='text' placeholder='Roll Number' required/>
      <input name='name' type='text' placeholder='Name' required/>
      <button type='submit' id='addstd' >Add Student</button>
    </form>
  )
}


export default class Students extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      addingStudent:false,
      showingDetails:false,
      showingMarks:false,
      showingAttendance:false,
      classname:''
    };
    this.students = [];
  }

  static contextType = UserContext;

  async loadName(){
    const query=`query classname($classid:ID!){
      classname(classid:$classid)
    }`;
    const vars = {
      classid:this.props.match.params.class,
    };
    const data = await graphQLFetch(query,vars);
    this.setState({classname:data.classname});
  }

  async loadData(){
    const query=`query students($classid:ID!){
      students(classid:$classid){
        _id name rollnumber marks{ nameofexam score maxscore } attendance{ date present }
      }
    }`;
    const vars = {
      classid:this.props.match.params.class,
    };
    const data = await graphQLFetch(query,vars);
    this.students = data.students;
    let i=1;
    this.students.forEach(std=>{
      std.i = i++;
    });
    this.setState({
      loading:false,
    });
  }

  componentDidMount(){
    this.loadName();
    this.loadData();
  }

  handleBack(){
    this.setState({
      showingAttendance:false,
      showingDetails:false,
      showingMarks:false,
      addingStudent:false,
    });
  }

  handleDetails(){
    this.setState({
      showingDetails:true,
      showingMarks:false,
      showingAttendance:false,
      addingStudent:false,
    });
  }

  handleAttendance(){
    this.setState({
      showingDetails:false,
      showingMarks:false,
      showingAttendance:true,
      addingStudent:false,
    });
  }

  handleMarks(){
    this.setState({
      showingDetails:false,
      showingMarks:true,
      showingAttendance:false,
      addingStudent:false,
    });
  }

  handleAdd(){
    this.setState({
      showdingDetails:false,
      showingAttendance:false,
      showingMarks:false,
      addingStudent:true,
    })
  }

  async handleDelete(){
    let conf = window.confirm("Are you sure you want to delete the class?");
    if(!conf)
    return;
    const { userData } = this.context;
    this.setState({
      loading:true,
    });
    const query=`mutation deleteClass($classid:ID!,$teacherid:ID!){
      deleteClass(classid:$classid,teacherid:$teacherid)
    }`;
    const vars={
      classid:this.props.match.params.class,
      teacherid:userData.user.id,
    };
    await graphQLFetch(query,vars);
    this.setState({
      loading:false,
    });
    alert("class deleted, app will reload now");
    window.location.reload();
  }

  render(){
    let view = (
      <div className='classcontainer'>
        <button className='btn' onClick={()=>{this.handleDetails()}}> Students' Details</button>
        <button className='btn' onClick={()=>{this.handleAttendance()}}> Take Attendance</button>
        <button className='btn' onClick={()=>{this.handleMarks()}}> Add Marks</button>
        <button className='btn' onClick={()=>{this.handleAdd()}}> Add Students</button>
        <button className='btn' style={{background:"#aa0000",cursor:'pointer'}} onClick={()=>{this.handleDelete()}}>Delete Class</button>
      </div>
    );
    if(this.state.showingAttendance){
      view = (
        <div>
          <button className='backbtn' onClick={()=>{this.handleBack()}}>Back</button>
          <Attendance loadData={()=>{this.loadData()}} handleBack={()=>{this.handleBack()}} students={this.students} />
        </div>
      );
    }
    else if(this.state.showingDetails){
      view = (
        <div>
          <button className='backbtn' onClick={()=>{this.handleBack()}}>Back</button>
          <StudentDetails students={this.students} />
        </div>
      );
    }
    else if(this.state.showingMarks){
      view = (
        <div>
          <button className='backbtn' onClick={()=>{this.handleBack()}}>Back</button>
          <Marks loadData={()=>{this.loadData()}} handleBack={()=>{this.handleBack()}} students={this.students} />
        </div>
      );
    }
    else if(this.state.addingStudent){
      view=(
        <div>
          <button className='backbtn' onClick={()=>{this.handleBack()}}>Back</button>
          <AddStudent loadData={()=>{this.loadData()}} handleBack={()=>{this.handleBack()}} sample={this.students[0]} classid={this.props.match.params.class} />
        </div>
      )
    }

    return (
      <div className='container'>
      {this.state.loading?<Loader type="ThreeDots" color="#254e58" height={80} width={80} />:
        (<><h2 className='welcomeText' style={{paddingLeft:0, paddingBottom:30}}>{this.state.classname}</h2>
        {view}</>
        )}
      </div>
    )
  }
}