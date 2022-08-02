import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import axios from 'axios';

import { matchPath } from 'react-router'

const baseUrl = process.env.REACT_APP_BACKEND_URL;

class EditComponent extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      dataChatBot:{},
      campStatus: "",
      campMsgFrom:"",
    }
  }
  

  componentDidMount(){

    const match = matchPath(this.props.history.location.pathname, {
      path: '/editChatBot/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    console.log(userId);
    const url = baseUrl+"/chatBot/get/"+userId
    axios.get(url)
    .then(res=>{
      if (res.data.success) {
        const data = res.data.data[0]
        this.setState({
          dataChatBot:data,
          campStatus:data.status,
          campMsgFrom:data.msgFrom
        })
      }
      else {
        alert("Error web service")
      }
    })
    .catch(error=>{
      alert("Error server "+error)
    })
  }

  render(){
    return (
      <div>
        <div class="form-row justify-content-center">
          <div class="form-group col-md-6">
            <label for="inputEmail4">Status</label>
            <input type="text" class="form-control"  placeholder="ok || off"
              value={this.state.campStatus} onChange={(value)=> this.setState({campStatus:value.target.value})}/>
          </div>
          <div class="form-group col-md-6">
            <label for="inputEmail4">Usuário</label>
            <input type="text" class="form-control"  placeholder="553588754197"
              value={this.state.campMsgFrom} onChange={(value)=> this.setState({campMsgFrom:value.target.value})}/>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" onClick={()=>this.sendUpdate()}>Atualizar</button>
      </div>
    );
  }

  sendUpdate(){
   
    const match = matchPath(this.props.history.location.pathname, {
      path: '/editChatBot/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    
    // parametros de datos post
    const datapost = {
      status : this.state.campStatus,
      msgFrom : this.state.campMsgFrom
    }

    axios.post(baseUrl + "/chatBot/update/"+userId,datapost)
    .then(response=>{
      if (response.data.success===true) {
        alert(response.data.message)
      }
      else {
        alert("Error")
      }
    }).catch(error=>{
      alert("Error 34 "+error)
    })

   }

}


export default EditComponent;
