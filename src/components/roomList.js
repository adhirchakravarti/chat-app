import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes);

class roomList extends React.Component {
    constructor(props){
        super(props);
        this.handleDblClick = this.handleDblClick.bind(this);
        this.contextMenu = this.contextMenu.bind(this);
        this.handleCloseChatRoom = this.handleCloseChatRoom.bind(this);
    }

    componentDidMount(){
        console.log(this.props);
    }
    handleDblClick(e, roomId){
        e.preventDefault();
        console.log(roomId);
        this.props.changeActiveRoom(roomId);
    }
    handleCloseChatRoom(e, roomId) {
        e.preventDefault();
        e.stopPropagation();
        console.log(`room to close = ${roomId}`);
        this.props.deleteRoom(roomId);
    }
    contextMenu(e) {
        e.preventDefault();
        alert('right-click!');
    }
    render(){
        return (
            <div className ="room-list">
                <h4>Rooms</h4>
                <ul className="room-list__listItems">
                    {this.props.rooms.map((room)=>{
                        return (
                            <li key={room.id}>
                                <div className = "room-name" onDoubleClick={(e)=>this.handleDblClick(e, room.id)} 
                                    onContextMenu={this.contextMenu}>{room.name} ({room.id})<FontAwesomeIcon className="close-button" icon="times" onClick={(e)=>this.handleCloseChatRoom(e,room.id)} name="icon"/>
                                </div>
                                {/* <FontAwesomeIcon icon="times" onClick={(e)=>this.handleCloseChatRoom(e,room.id)} name="icon"/> */}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default roomList;