import React from 'react';

class UserList extends React.Component {
    constructor(props){
        super(props);
        this.handleNewChat = this.handleNewChat.bind(this);
    }
    
    componentDidMount(){
      
    }
    componentDidUpdate() {
      console.log(this.props);
    }
    handleNewChat(e,userId){
        e.preventDefault();
        console.log(userId);
        this.props.newChatRoom(userId);
    }
    render() {
        return (
            <div className="user-list">
                <h4>Users</h4>
                <ul className="user-list__listItems">
                    {this.props.users.map((user, index) => {
                          // if (user.id === this.props.currentUser.id){
                          //   return (
                          //     <li className="currentUser" key={user.id} onClick={(e)=>this.handleNewChat(e, user.id)} name={user.name}>
                          //       <div>{`${user.name} (ID: ${user.id})`}</div>
                          //     </li>
                          //   )
                          // } else {
                            return (
                              <li  key={user.id} onDoubleClick={(e)=>this.handleNewChat(e, user.id)} name={user.name}>
                                  <div>{`${user.name} (ID: ${user.id})`}</div>
                              </li>
                              );
                          //}
                      })
                    }
                </ul>
            </div>
        )
    }
}

export default UserList;