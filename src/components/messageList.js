import React from 'react';
import '../styles/messageList.css';

class MessageList extends React.Component {
    // eslint-disable-next-line
    constructor(props){
        super(props);
        console.log(props);
    }

    componentDidMount() {
        console.log(this.props);
    }

    componentDidUpdate(prevProps) {
        console.log(this.props);
        let chatItems = document.querySelectorAll(".message-list li");
        if (chatItems.length > 0) {
            let last = chatItems[chatItems.length-1];
            last.scrollIntoView();
        }
    }
    
    render() {
        return (
                <ul className="message-list">
                    {this.props.messages.map((message, index) => {
                        return (
                            <li  key={message.id} className="message">
                                <div>
                                    <div className="sender">{message.senderId}</div>
                                    <div className="timestamp">{message.createdAt}</div>
                                </div>
                                <div className="messageBody">{message.parts[0].payload.content}</div>
                            </li>
                        )
                    })}
                </ul>
        )
    }
}

export default MessageList;