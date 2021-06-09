import React from "react";
import {
  createSmartappDebugger,
  createAssistant,
} from "@sberdevices/assistant-client";
import APIHelper from "./APIHelper.js"
import "./App.css";
import { textSpanIntersectsWithPosition } from "typescript";



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
      state:4,
      rand: 0,

    }    
    this.myRef1 = React.createRef();
    this.myRef2 = React.createRef();
    this.myRef3 = React.createRef();
    this.myRef4 = React.createRef();
    this.myRef_reset = React.createRef();
    this.myRef_list_theme = React.createRef();
    this.myRef_show_res = React.createRef();
    this.myRef_close = React.createRef();
    this.Number_Answers = this.Number_Answers.bind(this);
    this.ChooseTopic = this.ChooseTopic.bind(this);
    this.NewQuestion = this.NewQuestion.bind(this);
    this.Compare = this.Сompare.bind(this);
    this.focus_1st_q = this.focus_1st_q.bind(this);
    this.focus_2st_q = this.focus_2st_q.bind(this);
    this.focus_3st_q = this.focus_3st_q.bind(this);
    this.focus_4st_q = this.focus_4st_q.bind(this);
    this.focus_reset_q = this.focus_reset_q.bind(this);
    this.blur_list_theme = this.blur_list_theme.bind(this);
    this.blur_show_res = this.blur_show_res.bind(this);
    this.blur_close = this.blur_close.bind(this);
    //Timeout = setTimeout(()=> this.assistant_global_event("next_question"), 3000);

    this.assistant = initializeAssistant(() => this.getStateForAssistant() );
    this.assistant.on("data", (event/*: any*/) => {
      console.log(`assistant.on(data)`, event);
      const { action } = event
      this.dispatchAssistantAction(action);
    });
    this.assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });
  }

  focus_1st_q() {
    this.myRef1.current.blur();
  }
  focus_2st_q() {
    this.myRef2.current.blur();
  }
  focus_3st_q() {
    this.myRef3.current.blur();
  }
  focus_4st_q() {
    this.myRef4.current.blur();
  }
  focus_reset_q(){
    this.myRef_reset.current.blur();
  }
  blur_list_theme(){
    this.myRef_list_theme.current.blur();
  }
  blur_show_res(){
    this.myRef_show_res.current.blur();
  }

  blur_close(){
    this.myRef_close.current.blur();
  }

  focusTextInput = () => {
    // Focus the text input using the raw DOM API
    if (this.textInput) this.textInput.focus();
    console.log("ssssssssssssssssssssssssssss");
  };
  
  componentDidMount() {   
    console.log('componentDidMount');
    APIHelper.getAllQuestion().then(quest=>{
     this.setState({ questions: quest});
     console.log('questions',this.state.questions)   
      this.allTopics ()
      this.setState({state:0 });
    });
    this.focusTextInput();
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
        case 'close':{
          this.assistant.close();
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
    console.log("ChooseTopic(number)");
    let temp=number-1;
    this.setState({
      state:1,
      topic:{id: this.state.list_of_topics[temp].topic, topic: this.state.list_of_topics[temp].topic, 
      start:this.state.list_of_topics[temp].start, finish:this.state.list_of_topics[temp].finish}},
      ()=>{ this.NewQuestion()})
  }

  Number_Answers (temp)  {
    console.log("Number_Answers (temp)");
    if(this.state.state_answer === 0){
      if(temp==='один'||temp==='первый'||temp==='1'||temp===1){
        this.setState({answer:this.state.questions[this.state.rand].answer1},()=>this.Compare());
        this.timer();
      }
      else if(temp==='два'||temp==='второй'||temp==='2'||temp===2){
        this.setState({answer:this.state.questions[this.state.rand].answer2},()=>this.Compare());
        this.timer();
      }
      else if(temp==="три"||temp==="третий"||temp==="3"||temp===3){
        this.setState({answer:this.state.questions[this.state.rand].answer3},()=>this.Compare());
        this.timer();
      }
      else if(temp==="четыре"||temp==="четвертый"||temp==="4"||temp===4){
        this.setState({answer:this.state.questions[this.state.rand].answer4},()=>this.Compare());
        this.timer();
      }
    }
    this.setState({state_answer: 1});
  }

  Сompare(){
    if(this.state.answer===this.state.questions[this.state.rand].true_answer) {
      this.setState({result:"Верно"}, ()=>{this.Result();});
    }   
    else {
      this.setState({result:"Неверно"}, ()=>{this.Result()});
    };
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
    console.log("NewQuestion()");
    const min=this.state.topic.start;
    const max=this.state.topic.finish;   
    let random=this.getRandomArbitrary(min, max);
    while(random===this.state.rand){
      console.log("the same");
      random=this.getRandomArbitrary(min, max);
    }
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
    return( 
     <ul  >
   
       <button  className = "Topics" onClick={() => this.assistant_param(this.state.list_of_topics[0].id, "choose_theme")}>{this.state.list_of_topics[0].id}. {this.state.list_of_topics[0].topic}</button>
       <button  className = "Topics" onClick={() => this.assistant_param(this.state.list_of_topics[1].id, "choose_theme")}>{this.state.list_of_topics[1].id}. {this.state.list_of_topics[1].topic}</button>
       <button  className = "Topics" onClick={() => this.assistant_param(this.state.list_of_topics[2].id, "choose_theme")}>{this.state.list_of_topics[2].id}. {this.state.list_of_topics[2].topic}</button>
       <button  className = "Topics" onClick={() => this.assistant_param(this.state.list_of_topics[3].id, "choose_theme")}>{this.state.list_of_topics[3].id}. {this.state.list_of_topics[3].topic}</button>

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
    this.assistant.sendData({
      action: {
        action_id: a
      }
    })
    if(a === "show_res"){
      this.ShowResults();
      this.blur_show_res();
    }
    else if(a === "del_res"){
      this.DeleteResults();
      this.focus_reset_q();
    }
    else if(a === "close"){
    }
    else{
      this.ShowTopics();
      this.blur_list_theme();
    }
    
  }

  timer() {
    console.log("timer()");
    const a = setTimeout(() => {
      this.NewQuestion();
    }, 2000);
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
      switch(n){
        case 1:
          this.focus_1st_q();
          break;
        case 2:
          this.focus_2st_q();
          break;
        case 3:
          this.focus_3st_q();
          break;
        case 4:
          this.focus_4st_q();
          break;
        default:
          break;
      }
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
       <ul className="positionButtons"> 
       <p><input type = "button" ref = {this.myRef_close}readOnly = {true} value = "Выход" onClick={() =>this.assistant_global_event("close")} className ="third_button"/></p>
        <p><input type = "button" ref = {this.myRef_show_res}readOnly = {true} value = "Результаты" onClick={() =>this.assistant_global_event("show_res")} className ="fourth_button"/></p>
       </ul>
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
    this.setState({show_results: []})
  }
  
  WriteQuestions(){
    console.log("WriteQuestions()");
    return(    
    <div className="App">
 <div className="Answers">
        <div className="Questions"> {this.state.questions[this.state.rand].task}</div>
          <div className="button_res">
            <p><input  className= "Hieght"ref = {this.myRef1} type = "button" value = {1 + '. ' + this.state.questions[this.state.rand].answer1} onClick={() => this.assistant_param(1, "answer")} className = "but_res"/></p>
            <p><input ref = {this.myRef2} type = "button" value = {2 + '. ' + this.state.questions[this.state.rand].answer2} onClick={() => this.assistant_param(2, "answer")} className = "but_res"/></p>
            <p><input ref = {this.myRef3} type = "button" value = {3 + '. ' + this.state.questions[this.state.rand].answer3} onClick={() => this.assistant_param(3, "answer")} className = "but_res"/></p>
            <p><input ref = {this.myRef4} type = "button" value = {4 + '. ' + this.state.questions[this.state.rand].answer4} onClick={() => this.assistant_param(4, "answer")} className = "but_res"/></p>
           <div className="Result">
          <ul >Ответ: {this.state.answer}</ul>
          <ul> Результат: {this.state.result} </ul> 
          </div>
        </div>
      </div>

     <ul className="positionButtons">
        <p><input type = "button" ref = {this.myRef_list_theme} readOnly = {true} value = "Список тем" onClick={() => this.assistant_global_event("list_theme")} className ="third_button"/></p>
        <p><input type = "button" ref = {this.myRef_show_res} readOnly = {true} value = "Результаты" onClick={() => this.assistant_global_event("show_res")} className ="fourth_button"/></p>
      </ul>
    </div>)
  }
  
  WriteResults(){
    return(    
    <div className="App">
      <div className="Results"> 
        <table /*border="1"  width="30%" height="50%" cellpadding="0" cellspacing="0"*/>
          <thead>
            <tr>
                <th className="text_rez" colspan="5">Результаты</th>
            </tr>
            <tr>
              <th className="text_rez">Тема</th>
              <th className="text_rez">Задание</th>
              <th className="text_rez">Ответ</th>
              <th className="text_rez">Верный ответ</th>
              <th className="text_rez">Вердикт</th>
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
      <ul className="positionButtons">
      <p><input type = "button" ref = {this.myRef_list_theme} value = "Список тем" readOnly = {true} onClick={() => this.assistant_global_event("list_theme")} className ="third_button1"/></p>
      <p><input type = "button" ref = {this.myRef_reset} value = "Сброс" readOnly = {true} onClick={() => this.assistant_global_event("del_res")} className ="fourth_button1"/></p></ul>
    </div>)
  }
  WriteLoading(){
    return(
      <div className="App"><div className="position"><div className="loader" role="status">
</div>       </div></div>
    )
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
      case 4:
          return this.WriteLoading();
      default:
        break;
    
  }
  }
}