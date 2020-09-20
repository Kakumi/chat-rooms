import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import messages from '../data/messages.json';
import { addUser } from '../sockets/emit';

class HomePage extends React.Component {
    constructor(props) {
        super(props); //We get props from the parent
        this.updateUsername = this.updateUsername.bind(this); //We bind this to the function
        this.checkUsername = this.checkUsername.bind(this); //Same
        this.state = { //Default state for this page
            username: "",
            error: true,
            message: "",
            redirect: false
        }
    }

    //Check if username is right encoded
    checkUsername() {
        if (!this.state.error) { //If there is no error
            this.setState({redirect: true}); //Set redirect to true
            addUser(this.state.username); //Send an event to the server "add user" with username
        }
    }

    //Called everytime user edit the value
    updateUsername(event) {
        let value = event.target.value; //Get the value
        let message = ""; //Set error message to empty

        let emptyRegex = /^$/g; //Create regex for empty
        let formatUsername = /^([\w|-]+)$/g; //Create regex for allowed caracters
        if (value.match(emptyRegex)) { //If username is empty
            message = messages.fieldEmpty; //Set error message to field empty
        } else {
            if (value.length > event.target.maxLength) { //If username is longer than maximum length
                message = messages.usernameTooLong; //Set error message to username too long
            } else {
                if (!value.match(formatUsername)) { //If username doesn't match the allowed caracters's regex
                    message = messages.usernameFormatInvalid; //Set error message to format invalid
                }
            }
        }

        this.setState({ //Update the state
            username: value,
            error: !message.match(emptyRegex),
            message: message
        })
    }

    //Called when user press key on the input
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){ //If key is enter
            this.checkUsername(); //Call this function
        }
    }

    //Redirect to rooms page
    renderRedirect = () => {
        if (this.state.redirect) { //If redirect is true
            return <Redirect to='/rooms' /> //Redirect to /rooms
        }
    }

    //We set value on the input to username to block user input from the console or manual input and increase security
    //We set onChange on the input with the updateUsername
    //We set onKeyPress to authorize enter to do the same as the button
    //renderRedirect is always called but do nothing until we have redirect to true
    render() {
        return (
            <section id="home">
                {this.renderRedirect()}
                <div className="header">
                    <img src="./logo.png" alt="logo" />
                </div>
                <div id="login" className="mt-5">
                    <div className="form-group col-lg-4 col-md-6 m-auto">
                        <label htmlFor="username">{messages.username} :</label>
                        <input autocomplete="off" type="text" id="username" name="username" maxLength="30" className="form-control" required value={this.state.username} onChange={this.updateUsername} onKeyPress={this.handleKeyPress} autoFocus={true} />
                        <p id="error-username" className="text-danger font-italic">{this.state.message}</p>
                    </div>
    
                    <div className="col-lg-4 col-md-6 m-auto">
                        <input id="login" type="submit" className="btn btn-primary w-100" value={messages.login} onClick={this.checkUsername} />
                    </div>
                </div>
            </section>
        )
    }
}

export default withRouter(HomePage);
