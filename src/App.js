import React, { Component } from 'react';
import './App.css';
import SendMessageForm from './components/sendMessageForm';
import MessageList from './components/messageList';
import RoomList from './components/roomList';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import { instanceLocator, tokenProviderURL, userId } from './chatkitConfig';
import UserList from './components/userList';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages:[],
      messagesCurrentRoom:[],
      currentUser:null,
      currentRoomId:'19990129',
      roomSubscriptions:[],
      users:[],
      currentUsers:[]
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.createNewRoom = this.createNewRoom.bind(this);
    this.addUsersToState = this.addUsersToState.bind(this);
    this.fetchMessagesFromRoom = this.fetchMessagesFromRoom.bind(this);
    this.createNewRoom = this.createNewRoom.bind(this);
    this.changeActiveRoom = this.changeActiveRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    this.filterMessages = this.filterMessages.bind(this);
    this.filterUsers = this.filterUsers.bind(this);
  }

  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: userId,
      tokenProvider: new TokenProvider({
        url: tokenProviderURL
      })
    })
    chatManager.connect()
    .then(currentUser => {
      console.log('Successful connection', currentUser);
      console.log(currentUser.rooms, currentUser.users);
      this.setState(()=>({currentUser:currentUser}),()=>{
        console.log(this.state);
        for (let room of currentUser.rooms){
          console.log(room);
          this.subscribeToRoom(room.id);
        }
      });
    })
    .catch(err => {
      console.log('Error on connection', err)
    });
  }

  addUsersToState(room) {
    console.log(this.state.currentUser.users);
    //console.log(room.userStore.users);
    let userIds = [...room.userIds];
    let userArray = [];
    for (let userObj in room.userStore.users){
      if (userIds.includes(userObj)){
        userArray.push(room.userStore.users[userObj]);
      }
    }
    console.log(userArray);
    let usersByRoomId = {roomId:room.id, users:[...userArray]};
    this.setState((prevState)=>{
      return {
        users:prevState.users.concat(usersByRoomId)
      };
    },()=>{
      console.log(this.state);
      if (this.state.currentUsers.length === 0) {
        this.filterUsers();
      }
    });
    //currentUsers:prevState.currentUsers.length===0? [...userArray] : prevState.currentUsers
  }

  filterUsers() {
    let allUsers = [...this.state.users]
    let currentRoomId = this.state.currentRoomId;
    let filteredUsers = allUsers.find((userObj)=>userObj.roomId === currentRoomId);
    if (filteredUsers !== undefined){
      if (filteredUsers.hasOwnProperty('users')){
        this.setState((prevState)=>({currentUsers:filteredUsers.users}),()=>console.log(this.state));
      }
    }
  }

  subscribeToRoom(roomId) {
    this.state.currentUser.subscribeToRoomMultipart({
      roomId: roomId,
      hooks: {
        onMessage: (message) => {
          //console.log("New Message = ",message);
          let allMessages = [...this.state.messages];
          let found = allMessages.findIndex((item)=>item.id===message.id);
          if (found === -1) {
            allMessages.push(message);
            this.setState(()=>({messages:allMessages}), ()=>{
              this.filterMessages();
            });
          }
        }
      },
      messageLimit: 30
    })
    .then((room)=>{
      console.log("Room Subscription complete = ",room);
      this.setState((prevState)=>{
        return {
          roomSubscriptions:prevState.roomSubscriptions.concat(room)
        };
      });
      this.addUsersToState(room);
      //this.fetchMessagesFromRoom(room.id);
    })
    
  }

  filterMessages() {
    let allMessages = [...this.state.messages];
    let currentRoomId = this.state.currentRoomId;
    let relevantMessages = allMessages.filter((message)=>message.roomId === currentRoomId);
    this.setState((prevState)=>{
      return {
        messagesCurrentRoom:relevantMessages
      };
    }, ()=>console.log(this.state));
  }

  fetchMessagesFromRoom(roomId) {
    this.state.currentUser.fetchMultipartMessages({
      roomId: roomId,
      limit: 30
    })
    .then(messages => {
      console.log(`messages from current room ${roomId}`, messages);
      this.setState(()=>({messagesCurrentRoom:messages}),()=>console.log(this.state));
    })
    .catch(err => {
      console.log(`Error fetching messages: ${err}`)
    })
  }

  sendMessage (message) {
    console.log(message);
    //let currentUser = {...this.state.currentUser};
    console.log(this.state.currentUser.rooms);
    let currentRoomDetail = this.state.currentUser.rooms.find((room)=>room.id===this.state.currentRoomId);
    console.log(currentRoomDetail);
    this.state.currentUser.sendSimpleMessage({
      roomId: this.state.currentRoomId,
      text: message,
    })
    .then(messageId => {
      console.log(`Added message to ${currentRoomDetail.name}`)
    })
    .catch(err => {
      console.log(`Error adding message to ${currentRoomDetail.name}: ${err}`)
    })
  }

  createNewRoom(userId) {
    if (userId !== this.state.currentUser.id){
      this.state.currentUser.createRoom({
        name: `Privat Chat - ${userId}`,
        private: true,
        addUserIds: [userId]
      }).then(room => {
        console.log(`Created room called ${room.name}`)
        this.subscribeToRoom(room.id);
      })
      .catch(err => {
        console.log(`Error creating room ${err}`)
      });
    }
  }

  changeActiveRoom(roomId) {
    console.log(roomId);
    this.setState((prevState)=>({currentRoomId:roomId}),()=>{
      this.filterUsers();
      this.filterMessages();
    })
  }

  deleteRoom(roomId){
    let allRooms = [...this.state.roomSubscriptions];
    let allMessages = [...this.state.messages];
    let relevantRoom = allRooms.find((room)=>room.id === roomId);
    if (relevantRoom !== undefined && relevantRoom.isPrivate !== false) {
      this.state.currentUser.deleteRoom({ roomId: relevantRoom.id })
      .then(() => {
        console.log(`Deleted room with ID: ${relevantRoom.id}`);
        let remainingRooms = allRooms.filter((room)=>room.id !== relevantRoom.id);
        let remainingMessages = allMessages.filter((message)=>message.roomId !== relevantRoom.id);
        console.log(`remaining rooms = ${remainingRooms}`);
        this.setState((prevState)=>{
          return{
            roomSubscriptions:remainingRooms,
            messages:remainingMessages
          };
        },()=>console.log(this.state));
      })
      .catch(err => {
        console.log(`Error deleting room ${relevantRoom.id}: ${err}`)
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="row">
          <h4 className="title col-12">Simple-Chat-App</h4>
        </div>
        <div className = "container-fluid">
          <div className="row">
            <div className="col-2">
              <RoomList 
                  rooms={this.state.currentUser!==null? this.state.roomSubscriptions:[]} 
                  changeActiveRoom={this.changeActiveRoom}
                  deleteRoom={this.deleteRoom}/>
            </div>
            <div className="col-8">
              <MessageList messages={this.state.messagesCurrentRoom}/>
            </div>
            <div className="col-2">
              <UserList users={this.state.currentUsers} newChatRoom={this.createNewRoom}/>
            </div>
          </div>
        </div>
        <div className="row">
          <SendMessageForm sendMessage={this.sendMessage}/>
        </div>
      </div>
    );
  }
}

export default App;
