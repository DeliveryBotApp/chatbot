import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

class EditComponent extends React.Component{

 constructor(props){
   super(props);
   this.state = {
     campMensagem: "",
     campDestinatario: "",
     campDataEnvio: ""
   }
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
          <label for="inputEmail4">Destinatário</label>
          <input type="text" class="form-control"  placeholder="553588754197" value={this.state.campDestinatario} onChange={(value)=> this.setState({campDestinatario:value.target.value})}/>
        </div>
        <div class="form-group col-md-6">
          <label for="inputEmail4">Data de Envio</label>
          <input type="date" class="form-control"  placeholder="Data de Envio" value={this.state.campDataEnvio} onChange={(value)=> this.setState({campDataEnvio:value.target.value})}/>
        </div>
      </div>
      <button type="submit" class="btn btn-primary" onClick={()=>this.sendSave()}>Salvar</button>
    </div>
  );
}

sendSave(){

  if (this.state.campMensagem==="") {
    alert("O campo pergunta não pode estar vazio.")
  }
  else if (this.state.campDestinatario==="") {
     alert("O campo resposta não pode estar vazio.")
  }
  else if (this.state.campDataEnvio==="") {
    alert("O campo resposta não pode estar vazio.")
 }
  else {

    const datapost = {
      mensagem : this.state.campMensagem,
      destinatario : this.state.campDestinatario,
      dataEnvio : this.state.campDataEnvio
    }

    axios.post(baseUrl + "/agendamento/create",datapost)
    .then(response=>{
      if (response.data.success===true) {
        alert(response.data.message)
      }
      else {
        alert(response.data.message)
      }
    }).catch(error=>{
      alert("Error 34 "+ error)
    })

  }

}

}


export default EditComponent;