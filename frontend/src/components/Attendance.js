import React from 'react';
import graphQLFetch from '../GraphQLFetch';


export default class Attendance extends React.Component{
  constructor(props){
    super(props);
    this.state={
      sno:0,
    }
    this.studentnos=props.students.length;
    this.date='';
    this.attd=[];
  }

  async markAttendance(){
    for(let i=0;i<this.studentnos;i++){
      const query=`mutation markAttendance($studentID:ID!,$date:String!,$present:Boolean!){
        markAttendance(studentID:$studentID,date:$date,present:$present)
      }`
      const vars = {
        studentID:this.props.students[i]._id,
        date:this.date,
        present:this.attd[i],
      };
      await graphQLFetch(query,vars);
    }
  }

  async handlePresent(){
    const nos = this.state.sno;
    this.attd.push(true);
    if(nos===this.studentnos-1){
      await this.markAttendance();
      await this.props.loadData();
      this.props.handleBack();
    }
    this.setState({sno:nos+1});
  }

  async handleAbsent(){
    const nos = this.state.sno;
    this.attd.push(false);
    if(nos===this.studentnos-1){
      await this.markAttendance();
      await this.props.loadData();
      this.props.handleBack();
    }
    this.setState({sno:nos+1});
  }

  componentDidMount(){
    const d = new Date();
    this.date = d.getDate().toString() + '-' + d.getMonth().toString() + '-' + d.getFullYear().toString();
  }

  render(){
    let view='';
    if(this.studentnos === 0){
      view=<h3>No students added</h3>
    }
    else{
      view = (
        <div className='loginform' style={{marginTop:20}}>
          <h3 style={{paddingTop:20}}>{this.props.students[this.state.sno].rollnumber}</h3>
          <h3 style={{paddingTop:10}}>{this.props.students[this.state.sno].name} </h3>
          <button style={{marginTop:20, marginBottom:10}} onClick={()=>{this.handlePresent()}}>Present</button>
          <button style={{marginTop:10}} onClick={()=>{this.handleAbsent()}}>Absent</button>
        </div>
      )
    }
    return (
      <>{view}</>
    );
  }
}