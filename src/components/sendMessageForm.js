import React from 'react';

class SendMessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };
        this.chatInput = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(){
        this.chatInput.current.focus();
    }
    
    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        if (e.target.value !== ''){
            this.props.sendMessage(this.state.message);
            this.setState({
                message: ''
            });
        }
    }
    
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form col-12">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Enter your message and press ENTER to send"
                    type="text" 
                    autoFocus = {true}
                    ref={this.chatInput}/>
            </form>
        )
    }
}

export default SendMessageForm;