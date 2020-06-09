import React from 'react';
import graphQLFetch from '../GraphQLFetch';
import Loader from 'react-loader-spinner';


export default class Attendance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      gettingDate:true,
      sno:0,
    }
    this.studentnos=props.students.length;
    this.date='';
    this.attd=[];
  }

  async markAttendance(){
    this.setState({
      loading:true,
    });
    let promises = [];
    for(let i=0;i<this.studentnos;i++){
      const query=`mutation markAttendance($studentID:ID!,$date:String!,$present:Boolean!){
        markAttendance(studentID:$studentID,date:$date,present:$present)
      }`
      const vars = {
        studentID:this.props.students[i]._id,
        date:this.date,
        present:this.attd[i],
      };
      promises.push(graphQLFetch(query,vars));
    }
    Promise.all(promises)
    .then(async ()=>{
      await this.props.loadData();
      this.setState({
        loading:false,
      });
      this.props.handleBack();
    })
  }

  async handlePresent(){
    const nos = this.state.sno;
    this.attd.push(true);
    if(nos===this.studentnos-1){
      await this.markAttendance();
      return;
    }
    this.setState({sno:nos+1});
  }

  async handleAbsent(){
    const nos = this.state.sno;
    this.attd.push(false);
    if(nos===this.studentnos-1){
      await this.markAttendance();
      return;
    }
    this.setState({sno:nos+1});
  }

  getDate(e){
    e.preventDefault();
    const form = document.forms.gettingdate;
    const d = new Date(form.date.value);
    const lecno = parseInt(form.lectureno.value);
    if(lecno<0){
      alert("Lecture number cannot be negative");
      return;
    }
    this.date = d.getDate().toString() + '-' + d.getMonth().toString() + '-' + d.getFullYear().toString() + ` lec(${lecno})`;
    this.setState({gettingDate:false});
  }

  componentDidMount(){
    const d = new Date();
    this.date = d.getDate().toString() + '-' + d.getMonth().toString() + '-' + d.getFullYear().toString();
  }

  render(){
    let view='';
    if(this.state.gettingDate){
      view=
      <form className='loginform' name='gettingdate' style={{marginTop:10}} onSubmit={(e)=>{this.getDate(e)}}>
        <h3 style={{paddingTop:10}}>Enter Date and Lecture</h3>
        <input type='date' required name='date' />
        <input type='number' placeholder='Lecture number of the Day' defaultValue={1} required name='lectureno' />
        <button style={{marginTop:20, marginBottom:10}} type='submit'>Proceed</button>
        <button style={{marginTop:10}} onClick={()=>{this.setState({gettingDate:false})}}>Skip and use Today's date</button>
      </form>
    }
    else
    if(this.studentnos === 0){
      view=<h3>No students added</h3>
    }
    else{
      view = (
        <>
        {this.state.loading?<Loader style={{position:"absolute", top:'50vh', left:'50vw'}} type="TailSpin" color="#254e58" height={80} width={80} />:
        <div className='loginform' style={{marginTop:20}}>
          <span>{this.state.sno+1} / {this.studentnos}</span>
          <h3 style={{paddingTop:20}}>{this.props.students[this.state.sno].rollnumber}</h3>
          <h3 style={{paddingTop:10}}>{this.props.students[this.state.sno].name} </h3>
          <button style={{marginTop:20, marginBottom:10}} onClick={()=>{this.handlePresent()}}>Present</button>
          <button style={{marginTop:10}} onClick={()=>{this.handleAbsent()}}>Absent</button>
        </div>}
        </>
      )
    }
    return (
      <>{view}</>
    );
  }
}