import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, connectMenu} from "react-contextmenu";
import PropTypes from 'prop-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes);

const MENU_TYPE = 'DYNAMIC_ROOM';

function collect (props) {
    return props;
};

const DynamicMenu = (props) => {
    console.log("DM props = ",props);
    const { id, trigger } = props;
    //console.log(trigger, props);
    const handleItemClick = trigger ? trigger.onItemClick : null;

    return (
        <ContextMenu id={id}>
            {trigger && <MenuItem onClick={handleItemClick} data={{ action: 'AddUser' }}>{`Add user to room ${trigger.name}`}</MenuItem>}
        </ContextMenu>
    );
};

DynamicMenu.propTypes = {
    id: PropTypes.string,
    trigger: PropTypes.shape({
        name: PropTypes.string,
        onItemClick: PropTypes.func, 
        roomId: PropTypes.string
    })
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

class roomList extends React.Component {
    constructor(props){
        super(props);
        this.handleDblClick = this.handleDblClick.bind(this);
        this.contextMenu = this.contextMenu.bind(this);
        this.handleCloseChatRoom = this.handleCloseChatRoom.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
    handleClick(e, data) {
        console.log(e,data);
        let userId = prompt(`Enter userId of user to add to room ${data.name}`);
        console.log(userId);
        if (userId !== '' ) {
            let userExists = this.props.users.findIndex((userObj)=>userObj.id === userId);
            if (userExists === -1) {
                this.props.addUserToRoom(userId, data.roomId);
            }
        }
    }
    render(){
        return (
            <div className ="room-list">
                <h4>Rooms</h4>
                <ul className="room-list__listItems">
                    {this.props.rooms.map((room)=>{
                        return (
                            <li key={room.id}>
                                <ContextMenuTrigger id={MENU_TYPE} name={room.name} roomId={room.id}
                                                    collect={collect} onItemClick={this.handleClick}>
                                    <div className = "room-name" onDoubleClick={(e)=>this.handleDblClick(e, room.id)} 
                                        >{room.name} ({room.id})<FontAwesomeIcon className="close-button" icon="times" onClick={(e)=>this.handleCloseChatRoom(e,room.id)} name="icon"/>
                                    </div>
                                </ContextMenuTrigger>
                            </li>
                        );
                    })}
                </ul>
                <ConnectedMenu />
            </div>
        );
    }
}

export default roomList;