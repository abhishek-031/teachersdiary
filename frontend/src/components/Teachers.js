import React from 'react';
import graphQLFetch from '../GraphQLFetch.js';
import { Link } from 'react-router-dom';

export default class Teachers extends React.Component{
  constructor(props){
    super(props);
    this.state={
      teachers:[],
    };
  }

  async loadData(){
    const query = `query teachers($name:String!){
      teachers(name:$name){
        name
      }
    }`;
    const variables = {name:""};
    const data = await graphQLFetch(query,variables);
    this.setState({teachers:data.teachers});
  }

  componentDidMount(){
    this.loadData();
  }

  async handleSubmit(e){
    e.preventDefault();
    const form = document.forms.AddTeacher;
    const teacher = {
      name:form.teacher.value,
    };
    const query=`mutation addTeacher($teacher:TeacherInput!){
      addTeacher(teacher:$teacher){
        name
      }
    }`;
    const variables = {teacher};
    await graphQLFetch(query,variables);
    this.loadData();
  }

  render(){
    return(
      <div>
        <h2>Select teacher -</h2>
        {this.state.teachers.map(teacher=>{
          return (<div key={teacher.name}><Link to={`/${teacher.name}`}>{teacher.name}</Link></div>);
        })}
        <h2>Add Teacher</h2>
        <form name='AddTeacher' onSubmit={(e)=>{this.handleSubmit(e)}}>
          <input type='text' name='teacher' placeholder='Teacher Name' />
          <button>Add Teacher</button>
        </form>
      </div>
    );
  }

}