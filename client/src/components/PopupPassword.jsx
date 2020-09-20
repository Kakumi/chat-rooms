import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import { withRouter, Redirect } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import messages from '../data/messages.json';

const PopupMdp = (props) => {
    const [password, setPassword] = useState(); //Store the password
    const [message, setMessage] = useState(); //Store the error message
    const [redirect, setRedirect] = useState(); //Store if we have to redirect

    //When user update the password value from the input
    function handleChange(event) {
        let value = event.target.value; //Set the value

        setPassword(value); //Set the password

        let emptyRegex = /^$/g; //Create empty regex
        if (value.match(emptyRegex)) { //If value is empty
            setMessage(messages.fieldEmpty); //Set error message to field empty
        } else {
            setMessage(""); //Set error message to empty
        }
    }

    //Check if password exist
    function checkPassword() {
        if (props.password === password) { //If password is the same as the room's password
            setRedirect(true); //Set redirect to true
            setMessage(""); //Set error message to empty
        } else {
            setMessage(messages.incorrectPassword); //Set error message to password incorrect
        }
    }

    //Fired on key press on the input
    function handleKeyPress(event) {
        if(event.key === 'Enter') { //If key is enter
            checkPassword(); //Check the password
        }
    }

    function renderRedirect() {
        if (redirect) { //If redirect
            return <Redirect to={'/room/' + props.id} /> //Redirect to the chat room
        }
    }

    //renderRedirect is always called but do nothing until we have redirect to true
    //We set value on the input to password to block user input from the console or manual input and increase security
    //We set onChange on the input with the handleChange to update password value
    //We set onKeyPress to authorize enter to redirect if password match the room password
    return (
        <>
            {renderRedirect()}
            <Popup trigger={props.trigger} modal>
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>&times;</button>
                        <div className="header">{messages.chatRoomTitle} {props.nom}</div>
                        <div className="content">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor={"pwd-" + props.id}>{messages.password}</label>
                                </div>
                                <div className="col-md-9">
                                    <input autocomplete="off" type="password" id={"pwd-" + props.id} className="form-control" value={password} onChange={handleChange} onKeyPress={handleKeyPress} />
                                </div>
                            </div>
                            <p className="text-danger font-italic mb-0 pt-2">{message}</p>
                        </div>
                    </div>
                )}
            </Popup>
        </>
    );
};

export default withRouter(PopupMdp);
