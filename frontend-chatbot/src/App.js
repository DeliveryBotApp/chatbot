import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Form from './module/form';
import List from './module/list';
import Edit from './module/edit';
import FormAgendamento from './module/formAgendamento';
import EditAgendamento from './module/editAgendamento';
import ListAgendamento from './module/listAgendamento';
import CSVPergunta from './module/csvPergunta';
import CSVAgendamento from './module/csvAgendamento';
import ListDialogFlow from './module/listDialogFlow';
import EditDialogFlow from './module/editDialogFlow';
import FormDialogFlow from './module/formDialogFlow';
import ListChatBot from './module/listChatBot';
import EditChatBot from './module/editChatBot';
import FormChatBot from './module/formChatBot';
import ListHorario from './module/listHorario';
import EditHorario from './module/editHorario';
import FormHorario from './module/formHorario';
import ListLimite from './module/listLimite';
import EditLimite from './module/editLimite';
import FormLimite from './module/formLimite';
import ListProtocolo from './module/listProtocolo';
import EditProtocolo from './module/editProtocolo';
import FormProtocolo from './module/formProtocolo';

function App() {
  return (
    <Router>
    <div className="App">
         <a class="navbar-brand" href="https://whatscontabil.com.br/" style={{color:'orange',fontWeight:'bold', marginLeft:'700px'}}>Implementações ChatBot</a>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent" style={{color:'orange',fontWeight:'bold', marginLeft:'200px'}}>
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <Link class="btn btn-info" to="/"> Listar perguntas</Link>
                {'   '}
                <Link class="btn btn-info" to="/form">Adicionar Perguntas</Link>
                {'   '}
              { /* <Link class="btn btn-info" to="/csvPergunta">Importar Perguntas</Link> */}
                {'   '}
                <Link class="btn btn-info" to="/listAgendamento">Listar Agendamento</Link>
                {'   '}
                <Link class="btn btn-info" to="/formAgendamento">Adicionar Agendamento</Link>
                {'   '}
                <Link class="btn btn-info" to="/csvAgendamento">Importar Agendamento</Link>
                {'   '}
                <Link class="btn btn-info" to="/listProtocolo">Protocolos</Link>
                {'   '}
                {/* <Link class="btn btn-info " to="/formProtocolo">Adicionar Protocolo</Link>
                {'   '} */}
               {/* <Link class="btn btn-info" to="/listDialogFlow">DialogFlow</Link> */}
                {'   '}
                <Link class="btn btn-info" to="/listChatBot">ChatBot</Link>
                {'   '}
                <Link class="btn btn-info" to="/listHorario">Horários</Link>
                {'   '}
                <Link class="btn btn-info" to="/listLimite">Limites</Link>
                {/* {'   '}
                <Link class="btn btn-info " to="/formDialogFlow">Adicionar DialogFlow</Link> */}
              </li>
            </ul>
          </div>
        </nav>

        <div class="container py-4">
          <div class="row">
            <Route path="/" exact component={List} />
            <Route path="/form" component={Form} />
            <Route path="/edit/:perguntasId" component={Edit} />
            <Route path="/listAgendamento" exact component={ListAgendamento} />
            <Route path="/formAgendamento" component={FormAgendamento} />
            <Route path="/csvPergunta" component={CSVPergunta} />
            <Route path="/csvAgendamento" component={CSVAgendamento} />
            <Route path="/editAgendamento/:perguntasId" component={EditAgendamento} />
            <Route path="/listDialogFlow" exact component={ListDialogFlow} />
            <Route path="/editDialogFlow/:dialogId" exact component={EditDialogFlow} />
            <Route path="/formDialogFlow" exact component={FormDialogFlow} />
            <Route path="/listChatBot" exact component={ListChatBot} />
            <Route path="/editChatBot/:chatbotId" exact component={EditChatBot} />
            <Route path="/formChatBot" exact component={FormChatBot} />
            <Route path="/listHorario" exact component={ListHorario} />
            <Route path="/editHorario/:horarioId" exact component={EditHorario} />
            <Route path="/formHorario" exact component={FormHorario} />
            <Route path="/listLimite" exact component={ListLimite} />
            <Route path="/editLimite/:limiteId" exact component={EditLimite} />
            <Route path="/formLimite" exact component={FormLimite} />
            <Route path="/listProtocolo" exact component={ListProtocolo} />
            <Route path="/editProtocolo/:protocoloId" exact component={EditProtocolo} />
            <Route path="/formProtocolo" exact component={FormProtocolo} />
          </div>
        </div>

      </div>
      </Router>
  );
}

export default App;
