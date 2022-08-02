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
      dataAgenda:{},
      campMensagem: "",
      campDestinatario:"",
      campDataEnvio:""
    }
  }
  

  componentDidMount(){

    const match = matchPath(this.props.history.location.pathname, {
      path: '/editAgendamento/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    console.log(userId);
    const url = baseUrl+"/agendamento/get/"+userId
    axios.get(url)
    .then(res=>{
      if (res.data.success) {
        const data = res.data.data[0]
        this.setState({
          dataAgenda:data,
          campMensagem:data.mensagem,
          campDestinatario:data.destinatario,
          campDataEnvio:data.dataEnvio
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
          <div class="form-group col-md-12">
          <label for="inputPassword4">Mensagem </label>
          {/* <input type="text" class="form-control"  placeholder="Mensagem" value={this.state.campMensagem} onChange={(value)=> this.setState({campMensagem:value.target.value})}/> */}
          <textarea 
          class="form-control"
					name="campMensagem" 
					cols="40" 
					rows="5"
					value={this.state.campMensagem} 
					onChange={(value)=> this.setState({campMensagem:value.target.value})}
					required="required"
					placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
				></textarea>
          </div>
          <div class="form-group col-md-6">
            <label for="inputEmail4">Destinatario</label>
            <input type="text" class="form-control"  placeholder="Destinatário"
              value={this.state.campDestinatario} onChange={(value)=> this.setState({campDestinatario:value.target.value})}/>
          </div>
          <div class="form-group col-md-6">
            <label for="inputEmail4">Data de Envio</label>
            <input type="date" class="form-control"  placeholder="Data de Envio"
              value={this.state.campDataEnvio} onChange={(value)=> this.setState({campDataEnvio:value.target.value})}/>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" onClick={()=>this.sendUpdate()}>Atualizar</button>
      </div>
    );
  }

  sendUpdate(){
   
    const match = matchPath(this.props.history.location.pathname, {
      path: '/editAgendamento/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    
    // parametros de datos post
    const datapost = {
      mensagem : this.state.campMensagem,
      destinatario : this.state.campDestinatario,
      dataEnvio : this.state.campDataEnvio
    }

    axios.post(baseUrl + "/agendamento/update/"+userId,datapost)
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