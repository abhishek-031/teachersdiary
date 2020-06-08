import React from 'react';
import graphQLFetch from '../GraphQLFetch';

export default class Marks extends React.Component{
  constructor(props){
    super(props);
    this.state={
      addingDetails:true,
      sno:0,
    }
    this.nameofexam = '';
    this.maxscore = 0;
    this.marks=[];
    this.nostudents=props.students.length;
  }

  handleSubmit(e){
    e.preventDefault();
    const form = document.forms.details;
    this.nameofexam = form.nameofexam.value.toUpperCase();
    this.maxscore = parseInt(form.maxscore.value);
    if(this.maxscore<0){
      alert('Value of maximum marks cannot be negative');
      return;
    }
    this.setState({addingDetails:false});
  }

  async finalSubmit(){
    for(let i=0;i<this.nostudents;i++){
      const query = `mutation addMarks($studentID:ID!,$maxscore:Int!,$score:Int!,$nameofexam:String!){
        addMarks(studentID:$studentID,maxscore:$maxscore,score:$score,nameofexam:$nameofexam)
      }`;
      const vars={
        studentID:this.props.students[i]._id,
        maxscore:this.maxscore,
        score:this.marks[i],
        nameofexam:this.nameofexam,
      };
      await graphQLFetch(query,vars);
    }
  }

  async handleMarksSubmit(e){
    e.preventDefault();
    
    const nos = this.state.sno;
    const form = document.forms.entermarks;
    const marks = parseInt(form.marks.value);
    if(marks>this.maxscore){
      alert("value greater than max score");
      return;
    }
    if(marks<0){
      alert("value of marks cannot be negative");
      return;
    }
    this.marks.push(marks);
    if(nos===this.nostudents-1){
      await this.finalSubmit();
      await this.props.loadData();
      this.props.handleBack();
    }
    form.marks.value='';
    this.setState({sno:nos+1});
  }


  render(){
    let view = '';
    if(this.nostudents===0){
      view=<h3>No students in class</h3>
    }
    else if(this.state.addingDetails){
      view = (
        <form style={{marginTop:10}} className='loginform' name='details' onSubmit={(e)=>{this.handleSubmit(e)}}>
          <h3>Details of Exam</h3>
          <input name='nameofexam' type='text' placeholder='Name of Exam' required/>
          <input name='maxscore' type='number' placeholder='Maximum marks' required/>
          <button type='submit' >Submit Details and Enter Marks</button>
        </form>
      );
    }
    else{
      view = (
        <div className='loginform' style={{marginTop:10}}>
          <h3 style={{paddingBottom:0}}>{this.nameofexam}</h3>
          <h3 style={{paddingTop:10}}>Maximum Marks: {this.maxscore}</h3>
          <h3 style={{paddingTop:10,color:"#112d32"}}>For: {this.props.students[this.state.sno].name}</h3>
          <form name='entermarks' onSubmit={(e)=>{this.handleMarksSubmit(e)}}>
            <input type='number' name='marks' placeholder='Marks' max={`"${this.maxscore}"`} required/>
            <button type='submit'>Add Marks</button>
          </form>
        </div>
      );
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}