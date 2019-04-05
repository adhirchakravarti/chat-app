import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, connectMenu } from "react-contextmenu";
import '../styles/react-contextMenu.css';
import PropTypes from 'prop-types';

const MENU_TYPE = 'DYNAMIC_USER';

function collect (props) {
    return props;
};

const DynamicMenu = (props) => {
    const { id, trigger } = props;
    console.log(trigger, props);
    const handleItemClick = trigger ? trigger.onItemClick : null;

    return (
        <ContextMenu id={id}>
            {trigger && <MenuItem onClick={handleItemClick} data={{ action: 'Remove' }}>{`Remove ${trigger.name} from room`}</MenuItem>}
            {/* {trigger && (
                trigger.allowRemoval
                    ? <MenuItem onClick={handleItemClick} data={{ action: 'Removed' }}>{`Remove 1 ${trigger.name}`}</MenuItem>
                    : <MenuItem disabled>{'Removal disabled'}</MenuItem>
            )} */}
        </ContextMenu>
    );
};

DynamicMenu.propTypes = {
    id: PropTypes.string.isRequired,
    trigger: PropTypes.shape({
        name: PropTypes.string.isRequired,
        onItemClick: PropTypes.func.isRequired
    })
};

const ConnectedMenu = connectMenu(MENU_TYPE)(DynamicMenu);

class UserList extends React.Component {
    constructor(props){
        super(props);
        this.handleNewChat = this.handleNewChat.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
    handleClick = (e, data) => {
        console.log(e,data);
        if (data.action === 'Remove') {
            console.log(data);
        } 
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
                                        <ContextMenuTrigger id={MENU_TYPE} holdToDisplay={1000} name={user.name}
                                            userId={user.id} onItemClick={this.handleClick} collect={collect}>
                                            <div>{`${user.name} (ID: ${user.id})`}</div>
                                        </ContextMenuTrigger>
                                    </li>
                                );
                            //}
                        })
                        }
                </ul>
                <ConnectedMenu />
            </div>
        )
    }
}

export default UserList;