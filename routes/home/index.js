import React, {Component} from 'react';
import { StyleSheet, ScrollView, ProgressBarAndroid, Dimensions, TouchableOpacity, Text, View, Modal } from 'react-native';

import ButtonGroupOptions from './ButtonGroupOptions';
import TodoList from './TodoList';
import LongPressModal from './LongPressModal';

import Requests from './../../Requests.js';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  progressBar: {
    height: SCREEN_HEIGHT/2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginRight: 25,
    padding: 10,
    paddingRight: 25,
    paddingLeft: 25,
    backgroundColor: '#58B759',
    borderRadius: 5
  }
});

class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      modalShow: false,
      selectedTodo: {},
      todos: [],
      buttons: ['Pendentes', 'Concluidos'],
      selected: 0 
    };
  }

  static navigationOptions = ({navigation}) => {
    const requestUpdate = navigation.getParam("requestUpdate");
    const addButton = (
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('EditAdd', {title: "Add To-do", requestUpdate})}>
        <Text style={{color: '#fff'}}>Add +</Text>
      </TouchableOpacity>
    );
    return {
      title: 'App Tarefas',
      headerStyle: {
        backgroundColor: '#094725',
        height: 75
      },
      headerTintColor: '#fff',
      headerRight: (addButton)
    };
  }

  componentDidMount(){
    this.props.navigation.setParams({requestUpdate: this._requestUpdate});
    const getInfoJSON = Requests.getRequest();
    getInfoJSON.then(respJson => {
      this.setState({todos: respJson.reverse()});
    }).catch(err => console.log(err));
  }

  onShowModal = (todo) => {
    this.setState({
      modalShow: !this.state.modalShow,
      selectedTodo: todo
    });
  }

  onHideModal = () => {
    this.setState({modalShow: !this.state.modalShow});
  }

  updateIndex = (selected) => {
    this.setState({selected});
  }

  onCompleteTask = (todo) => {
    todo.completed = !todo.completed;
    const {_id, title, time, description, completed} = todo;
    const putRequest = Requests.putRequest(_id, {title,time,description, completed});
    this._requestUpdate(putRequest);
  }

  onDeleteTodo = (id) => {
    const deleteRequest = Requests.deleteRequest(id);
    this._requestUpdate(deleteRequest);
    this.onHideModal();
  }

  _requestUpdate = (request) => {
    request.then(jsonResponse => {
      const getRequest = Requests.getRequest();
      getRequest.then(respJson => {
        this.setState({todos: respJson.reverse()});
      }).then(() => {
        this.props.navigation.navigate('Home')
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  render() {
    const { modalShow, todos, buttons, selected, selectedTodo } = this.state;
    const { navigation } = this.props;
    const progressBar = (<ProgressBarAndroid style={styles.progressBar}/>);

    return (
      <View>
        <LongPressModal 
          modalShow={modalShow} 
          onHideModal={this.onHideModal}
          selectedTodo={selectedTodo}
          onDeleteTodo={this.onDeleteTodo}
        />
        <ButtonGroupOptions 
          optionButtons={buttons} 
          onOptionChange={this.updateIndex} 
          selected={selected}
        />
        <ScrollView>
          {
            todos.length ? (
              <TodoList 
                todos={todos} 
                navigation={navigation} 
                selected={selected} 
                onShowModal={this.onShowModal}
                onCompleteTask={this.onCompleteTask}
              />
            ) : (
              progressBar
            )
          }
        </ScrollView>
      </View>
      
    );
  }
}

export default Home;