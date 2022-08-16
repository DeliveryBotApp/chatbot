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
      dataEmployee:{},
      campPergunta: "",
      campResposta:"",
      comDepartamento:"",
      campDepartamentoSelected: "0"
    }
  }
  

  componentDidMount(){

    const match = matchPath(this.props.history.location.pathname, {
      path: '/edit/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    console.log(userId);
    const url = baseUrl+"/perguntas/get/"+userId
    axios.get(url)
    .then(res=>{
      if (res.data.success) {
        const data = res.data.data[0]
        this.setState({
          dataEmployee:data,
          campPergunta:data.pergunta,
          campResposta:data.resposta,
          comDepartamento:data.idDepartamento        
        })
      }
      else {
        alert("Error web service")
      }
    })
    .catch(error=>{
      alert("Error server "+error)
    })

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
            <label for="inputPassword4">Pergunta</label>
            {/* <input type="text" class="form-control"  placeholder="Pergunta"
              value={this.state.campPergunta} onChange={(value)=> this.setState({campPergunta:value.target.value})}/> */}
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
            {/* <input type="email" class="form-control"  placeholder="Resposta"
              value={this.state.campResposta} onChange={(value)=> this.setState({campResposta:value.target.value})}/> */}
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
        <button type="submit" class="btn btn-primary" onClick={()=>this.sendUpdate()}>Atualizar</button>
      </div>
    );
  }

  sendUpdate(){
   
    const match = matchPath(this.props.history.location.pathname, {
      path: '/edit/:param',
      exact: true,
      strict: false
    })

    let userId = match.params.param;
    
    // parametros de datos post
    const datapost = {
      pergunta : this.state.campPergunta,
      resposta : this.state.campResposta,
      departamento : this.state.campDepartamentoSelected
    }

    axios.post(baseUrl + "/perguntas/update/"+userId,datapost)
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