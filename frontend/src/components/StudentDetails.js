import React from 'react';
import { Link } from 'react-router-dom';

export default class StudentDetails extends React.Component{
  constructor(props){
    super(props);
    this.state={
      attd:[],
    }
  }

  componentDidMount(){
    const attd = [];
    this.props.students.forEach(std=>{
      if(std.attendance){
        const ttl = std.attendance.length;
        let pres = 0;
        for(let i=0;i<ttl;i++){
          if(std.attendance[i].present){
            pres++;
          }
        }
        attd.push(`${pres}/${ttl} ( ${(pres/ttl)*100}% )`);
      }
      else{
        attd.push('0/0');
      }
    });
    this.setState({attd:attd});
  }

  render(){
    return (
      <table style={{marginTop:20}}>
        <thead>
          <tr>
            <th>SNo.</th>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Attendance</th>
            {this.props.students[0]?(this.props.students[0].marks?this.props.students[0].marks.map(mark=>{
              return (<th>{mark.nameofexam}</th>);
            }):""):""}
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map(student=>{
            return (
            <tr key={student.rollnumber}>
              <td>{student.i}</td>
              <td>{student.rollnumber}</td>
              <td>{student.name}</td>
              <td>{this.state.attd[student.i-1]}</td>
              {student.marks?student.marks.map(mark=>{
                return (
                  <td>{mark.score}/{mark.maxscore}</td>
                );
              }):""}
              <td><Link id='detailslink' to={`/student/${student._id}`}>view details</Link></td>
            </tr>);
          })}
        </tbody>
      </table>
    )
  }
}