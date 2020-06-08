import React from 'react';
import graphQLFetch from '../GraphQLFetch';
import Loader from 'react-loader-spinner';

class AttendanceRow extends React.Component{

  async editing(){
    const query=`mutation editAttendance($studentID:ID!,$index:Int!){
      editAttendance(studentID:$studentID,index:$index)
    }`;
    const vars={
      studentID:this.props.studentid,
      index:this.props.index,
    };
    const d = await graphQLFetch(query,vars);
    document.getElementById(`pres${this.props.index}`).innerHTML = d.editAttendance?"Present":"Absent";
  }

  render(){
    return (
      <> 
      <tr>
      <td>{this.props.date}</td>
      <td id={`pres${this.props.index}`}>{this.props.present?"Present":"Absent"}</td>
      <td><button className='editbtn' onClick={()=>{this.editing()}} >Edit</button></td>
      </tr> 
      </>
    );
  }
}


class MarksRow extends React.Component{
  constructor(props){
    super(props);
    this.state={
      editing:false,
    };
    this.score=0;
  }

  editing(){
    this.setState({editing:true});
  }

  async submitEdit(e){
    e.preventDefault();
    const form = document.forms.editmarks;
    const marks = parseInt(form.marks.value);
    if(marks>this.props.mark.maxscore){
      alert("Marks cannot be more than maximum marks");
      return ;
    }
    if(marks<0){
      alert("marks cannot be negative");
      return;
    }
    const query=`mutation editMarks($studentID:ID!,$index:Int!,$marks:Int!){
      editMarks(studentID:$studentID,index:$index,marks:$marks)
    }`;
    const vars = {
      studentID:this.props.studentid,
      index:this.props.index,
      marks:marks,
    };
    const m = await graphQLFetch(query,vars);
    this.score = m.editMarks;
    this.setState({
      editing:false,
    });
  }

  cancel(){
    this.setState({
      editing:false,
    });
  }

  componentDidMount(){
    this.score = this.props.mark.score;
  }

  render(){
    let view = '';
    if(this.state.editing){
      view = (
        <tr>
          <td> {this.props.mark.nameofexam} </td>
          <td> 
            <form name='editmarks' onSubmit={(e)=>{this.submitEdit(e)}}>
              <input name='marks' type='number' placeholder={this.props.mark.score} />
              <button className='editbtn' type='submit'>Submit</button> 
              <button className='editbtn' onClick={()=>{this.cancel()}}>Cancel</button>
            </form>
          </td>
          <td> {this.props.mark.maxscore} </td>
        </tr>
      );
    }
    else{
      view = (
        <tr>
          <td> {this.props.mark.nameofexam} </td>
          <td> {this.score===0?this.props.mark.score:this.score} <button className='editbtn' onClick={()=>{this.editing()}} >Edit</button> </td>
          <td> {this.props.mark.maxscore} </td>
        </tr>
      );
    }

    return (
      <>{view}</>
    )
  }
}

export default class Student extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      name:'',
      rollnumer:'',
      attendance:[],
      marks:[],
    };
    this.v=0;
    this.k=0;
  }

  async loadData(){
    const query = `query student($studentID:ID!){
      student(studentID:$studentID){
        _id name rollnumber attendance{ date present } marks{ nameofexam score maxscore }
      }
    }`;
    const vars = {
      studentID:this.props.match.params.studentid,
    };
    const data = await graphQLFetch(query,vars);
    this.setState({
      editingName:false,
      editingRno:false,
      loading:false,
      name:data.student.name,
      rollnumber:data.student.rollnumber,
      attendance:data.student.attendance,
      marks:data.student.marks,
    });
  }

  async componentDidMount(){
    await this.loadData();
  }

  async editName(e){
    e.preventDefault();
    const form = document.forms.editn;
    const name = form.editname.value.trim().toUpperCase();
    this.setState({
      editingName:false,
      name,
    });
    const query=`mutation{
      editStudent(name:"${name}",rollnumber:"${this.state.rollnumber}",sid:"${this.props.match.params.studentid}")
    }`;
    await graphQLFetch(query);
  }

  async editRno(e){
    e.preventDefault();
    const form = document.forms.editr;
    const rollnumber = form.editrn.value.trim().toUpperCase();
    this.setState({
      editingRno:false,
      rollnumber,
    });
    const query=`mutation{
      editStudent(name:"${this.state.name}",rollnumber:"${rollnumber}",sid:"${this.props.match.params.studentid}")
    }`;
    await graphQLFetch(query);
  }

  render(){
    return (
      <>
      {this.state.loading?<Loader style={{position:"absolute", top:'50vh', left:'50vw'}} type="ThreeDots" color="#254e58" height={80} width={80} />:
      <div>
        <div className='stddetails'>
          {this.state.editingName?
          <h2>
            <form name='editn' onSubmit={e=>{this.editName(e)}}>
            <input name='editname' placeholder={this.state.name} required/>
            <button type='submit' className='editbtn'>Submit</button>
            <button className='editbtn' onClick={()=>{this.setState({editingName:false})}}>Cancel</button>
            </form></h2>:
            <h2> Name: <>{this.state.name} <button onClick={()=>{this.setState({editingName:true})}}          className='editbtn'>Edit</button> </></h2>
          }
          {this.state.editingRno?
          <h2>
            <form name='editr' onSubmit={e=>{this.editRno(e)}}>
            <input name='editrn' placeholder={this.state.rollnumber} required/>
            <button type='submit' className='editbtn'>Submit</button>
            <button className='editbtn' onClick={()=>{this.setState({editingRno:false})}}>Cancel</button>
            </form></h2>:
            <h2> Roll Number: {this.state.rollnumber} <button onClick={()=>{this.setState({editingRno:true})}} className='editbtn'>Edit</button> </h2>
          }
        </div>
        <h3 className='welcomeText'>Attendance details:</h3>
        {this.state.attendance ?
        (<table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Attendance</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.attendance.map(day=>{
              return (
                <AttendanceRow key={this.v} index={this.v++} studentid={this.props.match.params.studentid} date={day.date} present={day.present} />
              );
            })}
          </tbody>
        </table>) : <h3 className='welcomeText'>No Attendance taken</h3>
  }
        <h3 className='welcomeText'>Marks details:</h3>
        {this.state.marks?
        (<table>
          <thead>
            <tr>
              <th>Name of Exam</th>
              <th>Marks Obtained</th>
              <th>Maximum marks</th>
            </tr>
          </thead>
          <tbody>
            {this.state.marks.map(mark=>{
              return (
                <MarksRow key={this.k} index={this.k++} mark={mark} studentid={this.props.match.params.studentid} />
              );
            })}
          </tbody>
          </table>):<h3 className='welcomeText'>No Exams taken</h3>}
      </div>
  }
      </>
    );
  }
}