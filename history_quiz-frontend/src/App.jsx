import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import APIHelper from "./APIHelper.js"
import "./App.css";



const initializeAssistant = (getState/*: any*/) => {

  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};



export class App extends React.Component {
  constructor(props) {
    super(props);
    console.log('constructor');
    this.state = {
      questions:[{"_id": "", "task": "", "answer1": "", "answer2": "", "answer3": "", "answer4": "", "true_answer": ""},],
      answer: '',
      result: '',
      state_answer: 0,
      list_of_topics:[],
      show_results: [],
      topic:{id:'', topic: '', start:0, finish:0},
      state:0,
      rand: 0,

    }    
    this.Number_Answers = this.Number_Answers.bind(this);
    this.ChooseTopic = this.ChooseTopic.bind(this);
    this.NewQuestion = this.NewQuestion.bind(this);
    this.Compare = this.Сompare.bind(this);
    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
    this.assistant_global_event("start");
  }

  componentDidMount() {   
    console.log('componentDidMount');
    APIHelper.getAllQuestion().then(quest=>{
     this.setState({ questions: quest});
     console.log('questions',this.state.questions)   
      this.allTopics ()
    })
  }

  getStateForAssistant () {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector:  this.state.notes
    };
    console.log('getStateForAssistant: state:', this.state.notes)
    return state;
  }

  dispatchAssistantAction (action) {
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'add_note':{
           this.Number_Answers(action.note);  
            break;
         }
        case 'new_note':{
           this.NewQuestion()
           break;
         }
        case 'new_topic':{
          this.ChooseTopic(action.note)
          break;
        }
        case 'new_topic_gp':{
          this.ChooseTopic(action.note)
          break;
        }
        case 'show_results':{
          this.setState({state: 2});
          break;
        }
        case 'return_topic':{
          this.setState({state: 0});
          break;
        }
        case 'reset_results':{
          this.setState({show_results: []});
          break;
        }
        default:
          break;
      }
    }
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  allTopics (){
    let number=0;
    let start=0;
    let finish=0;
    for(let i=0; i<this.state.questions.length-1;i++ ){
      if(this.state.questions[i].topic!==this.state.questions[i+1].topic){
        finish=i;
        number++;
        this.setState({ list_of_topics: [...this.state.list_of_topics, {id:number, topic:this.state.questions[i].topic, start:start, finish: finish}] });
        start=i+1;
      }
      if(i===this.state.questions.length-2){
        number++;
        this.setState({ list_of_topics: [...this.state.list_of_topics, {id:number, topic:this.state.questions[i].topic, start:start, finish:i}] });
       }
    }
  }

  ChooseTopic(number){
    let temp=number-1;
    this.setState({
      state:1,
      topic:{id: this.state.list_of_topics[temp].topic, topic: this.state.list_of_topics[temp].topic, 
      start:this.state.list_of_topics[temp].start, finish:this.state.list_of_topics[temp].finish}},
      ()=>{ this.NewQuestion()})
  }

  Number_Answers (temp)  {
    if(this.state.state_answer === 0){
      if(temp==='один'||temp==='первый'||temp==='1'||temp===1){
        this.setState({answer:this.state.questions[this.state.rand].answer1},()=>this.Compare());
      }
      else if(temp==='два'||temp==='второй'||temp==='2'||temp===2){
        this.setState({answer:this.state.questions[this.state.rand].answer2},()=>this.Compare());
      }
      else if(temp==="три"||temp==="третий"||temp==="3"||temp===3){
        this.setState({answer:this.state.questions[this.state.rand].answer3},()=>this.Compare());
      }
      else if(temp==="четыре"||temp==="четвертый"||temp==="4"||temp===4){
        this.setState({answer:this.state.questions[this.state.rand].answer4},()=>this.Compare());
      }
    }this.setState({state_answer: 1});
  }
  Сompare(){
    if(this.state.answer===this.state.questions[this.state.rand].true_answer)  
    this.setState({result:"Верно"}, ()=>{
      this.Result();
    });   
    else this.setState({result:"Неверно"}, ()=>{
      this.Result()});
  }
  Result(){
    this.setState({ show_results: [...this.state.show_results, 
      {topic: this.state.topic.topic, 
       task: this.state.questions[this.state.rand].task, 
       your_answer: this.state.answer,
       true_answer: this.state.questions[this.state.rand].true_answer, 
       result: this.state.result}] });
  }

  NewQuestion(){   
    const min=this.state.topic.start;
    const max=this.state.topic.finish;   
    const random=this.getRandomArbitrary(min, max);
    this.setState({
      state_answer: 0,
      state: 1,
      rand:random,
      answer: '',
      result: ''
    });
    console.log('max', max)
    console.log('min', min)
  }

  renderArrayTopics = () => {
    return this.state.list_of_topics.map(({ id, topic}) =>
     <ul className = "Topics">
       <input type="checkbox"  id={id}  onClick={() => this.assistant_param(id, "choose_theme")} classname='input_top'></input>
       <label for = {id}>{id} {topic}</label>
    </ul>);
  }

  renderArrayResults = () => 
  {
    return this.state.show_results.map(function res({ topic, task, your_answer, true_answer, result})
    {
      if(result === "Верно")
      {
        return(
        <tr>
          <td className = "Td">{topic} </td>
          <td className = "Td">{task} </td>
          <td>{your_answer} </td>
          <td>{true_answer} </td>
          <td  className = "td_green">{result}</td>
        </tr>
        );
      }
      else
      {
        return(
          <tr>
            <td className = "Td">{topic} </td>
            <td className = "Td">{task} </td>
            <td>{your_answer} </td>
            <td>{true_answer} </td>
            <td className = "td_red">{result}</td>
          </tr>
        )
      }
    })
  }
      
  assistant_global_event(a)  {
    if(this.assistant){
      console.log("assistant_global_event");
    }
    this.assistant.sendData({
      action: {
        action_id: a
      }
    })
  }

  assistant_param(n, state)  {
    this.assistant.sendData({
      action: {
        action_id: state,
        parameters: {
          number: n
        }
      }
    });
    if(state === "choose_theme"){
      this.ChooseTopic(n);
    }
    else{
      this.Number_Answers(n);
    }
  }

  WriteTopic(){
    return( 
    <div className="App">
        <div className = "Topics_div">{this.renderArrayTopics()}</div>
      <div>
        <div className='Text'>
        </div >
      </div>
      <p><button onClick={() =>/* this.WriteResults()*/ this.assistant_global_event("show_res")} className ="fourth_button">Результаты</button></p>
    </div>)
  }
  ShowTopics() {
    this.setState({state: 0});
    this.WriteTopic();
  }

  ShowResults() {
    this.setState({state: 2});
    this.render();
  }

  DeleteResults() {
    this.setState({show_results: []});
  }
  
  WriteQuestions(){
    return(    
    <div className="App">
      <div className="Answers">
        <div className="Questions"> {this.state.questions[this.state.rand].task}</div>
        <p><button onClick={() => this.assistant_param(1, "answer")} className = "but_res">Вариант 1: {this.state.questions[this.state.rand].answer1}</button></p>
        <p><button onClick={() => this.assistant_param(2, "answer")} className = "but_res">Вариант 2: {this.state.questions[this.state.rand].answer2}</button></p>
        <p><button onClick={() => this.assistant_param(3, "answer")} className = "but_res">Вариант 3: {this.state.questions[this.state.rand].answer3}</button></p>
        <p><button onClick={() => this.assistant_param(4, "answer")} className = "but_res">Вариант 4: {this.state.questions[this.state.rand].answer4}</button></p>
        <div className="Result">
          <ul>Ваш Ответ: {this.state.answer} </ul>
          <ul> Результат: {this.state.result} </ul> 
        </div>
      </div>
      <p><button onClick={() => this.assistant_global_event("list_theme")} className ="second_button"><span>Список тем</span></button></p>
      <p><button onClick={() => this.assistant_global_event("next_answer")} className ="third_button"><span>Следующий вопрос</span></button></p>
      <p><button onClick={() => this.assistant_global_event("show_res")} className ="fourth_button">Результаты</button></p>
    </div>)
  }
  
  WriteResults(){
    return(    
    <div className="App">
      <div className="Results"> 
        <table /*border="1"  width="30%" height="50%" cellpadding="0" cellspacing="0"*/>
          <thead>
            <tr>
                <th colspan="5">Результаты</th>
            </tr>
            <tr>
              <th>Тема</th>
              <th>Задание</th>
              <th>Ваш ответ</th>
              <th>Верный ответ</th>
              <th>Вердикт</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
               {this.renderArrayResults()}
          </tbody>
        </table>
      </div>
      <div>
        <div className='Text'>
        </div>
      </div>
      <p><button onClick={() => this.assistant_global_event("list_theme")} className ="third_button"><span>Список тем</span></button></p>
      <p><button onClick={() => this.assistant_global_event("del_res")} className ="fourth_button">Сброс результатов</button></p>
    </div>)
  }

  render() {
    console.log('render');
    switch(this.state.state){
      case 0:
        return this.WriteTopic();
      case 1:
        return this.WriteQuestions();
      case 2:
        return this.WriteResults();
      default:
        break;
    }
  }
}
