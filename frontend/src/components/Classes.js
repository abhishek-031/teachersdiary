import React from 'react';
import graphQLFetch from '../GraphQLFetch';
import { Link } from 'react-router-dom';
import CreateClass from './CreateClass';
import UserContext from '../UserContext';
import Loader from 'react-loader-spinner';


export default class Classes extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      classes:[],
      creatingClass:false,
    }
  }

  static contextType = UserContext;
  
  async loadData(){
    const { userData } = this.context;
    const query=`query{
      classes(name:"${userData.user.id}",session:"${this.props.match.params.session}"){
        name _id
      }
    }`;
    const data = await graphQLFetch(query);
    if(data.classes!==null){
      this.setState({
        loading:false,
        classes:data.classes,
      });
    }
    else{
      this.setState({
        loading:false,
      })
    }
  }

  doneCreating(){
    this.setState({creatingClass:false});
    this.loadData();
  }

  componentDidMount(){
    this.loadData();
  }

  handleClick(){
    this.setState({creatingClass:true});
  }

  render(){

    const { userData } = this.context;

    let view = (
      <div className='container'>
        <h3 className='welcomeText' id='classes'>SESSION {this.props.match.params.session}</h3>
        {this.state.loading?<Loader type="ThreeDots" color="#254e58" height={80} width={80} />:""}
        {this.state.classes.map(iclass=>{
          return (<div className='linkContainer' key={iclass._id}>
            <Link className='linkBox' to={`/${this.props.match.params.teacher}/${this.props.match.params.session}/${iclass._id}`} >{iclass.name} </Link> </div> )
        })}
        <button className='btn' onClick={()=>{this.handleClick()}}>Create Class</button>
      </div>
    )
    if(this.state.creatingClass){
      view = (
        <div>
          <CreateClass doneCreating={()=>{this.doneCreating()}} teacher={userData.user.id}/>
        </div>
      )
    }
    return (
      <div>
        {view}
      </div>
    )
  }
}