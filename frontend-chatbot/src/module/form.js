import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;
const baseAPI = process.env.REACT_APP_API_URL;

class EditComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      campPergunta: "",
      campResposta: "",
      campDepartamento: "",
      campDepartamentoSelected: "0"
    }
  }

  componentDidMount(){
    this.loadDepartamentos();
  }

  loadDepartamentos(){
    axios.get(baseUrl + "/departamentos/list")
    .then(res => {
      if(res.data.success){
        const data = res.data.data;
        this.setState({ campDepartamento:data });   
      }
      else{
          alert("Error web service");
      }
    })
    .catch(error => {
      alert("Error server " + error)
    });
  }

  loadFillData(){
    if (this.state.campDepartamento){
      return this.state.campDepartamento.map((data)=>{
        return(
          <option value={data.id}>{data.name}</option>
        )
      });
    } else {
      return "";
    }
  }

  render(){
    
    return (
      <div>
        <div class="form-row justify-content-center">
          
          <div class="form-group col-md-4">
            <label for="inputPassword4">Pergunta </label>
            {/* <input type="text" class="form-control"  placeholder="Pergunta" value={this.state.campPergunta} onChange={(value)=> this.setState({campPergunta:value.target.value})}/> */}
            <textarea 
            class="form-control"
            name="campPergunta" 
            cols="40" 
            rows="5"
            value={this.state.campPergunta} 
            onChange={(value)=> this.setState({campPergunta:value.target.value})}
            required="required"
            placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
          ></textarea>
          </div>

          <div class="form-group col-md-4">
            <label for="inputEmail4">Resposta</label>
            {/* <input type="text" class="form-control"  placeholder="Resposta" value={this.state.campResposta} onChange={(value)=> this.setState({campResposta:value.target.value})}/> */}
            <textarea 
            class="form-control"
            name="campResposta" 
            cols="40" 
            rows="5"
            value={this.state.campResposta} 
            onChange={(value)=> this.setState({campResposta:value.target.value})}
            required="required"
            placeholder="Olá, tudo bem?&#13;&#10;Como posso te ajudar?&#13;&#10;Abraços, a gente se vê!"
          ></textarea>
          </div>

          <div class="form-group col-md-4">
            <label for="inputPassword4" >Depto para Transferncia </label>
            <select class="form-control" onChange={ (value) => this.setState({campDepartamentoSelected: value.target.value})}>
              <option value="0">Escolha um departamento</option>
              {this.loadFillData()}
            </select>
          </div>

        </div>
        <button type="submit" class="btn btn-primary" onClick={()=>this.sendSave()}>Salvar</button>
      </div>
    );
  }

  sendSave(){

    if (this.state.campPergunta==="") {
      alert("O campo pergunta não pode estar vazio.")
    } else if (this.state.campResposta==="") {
      alert("O campo resposta não pode estar vazio.")
    } else {
      const datapost = {
        pergunta : this.state.campPergunta,
        resposta : this.state.campResposta,
        departamento : this.state.campDepartamentoSelected
      }
      
      axios.post(baseUrl + "/perguntas/create",datapost)
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