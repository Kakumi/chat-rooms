import React, {useState, useEffect, useContext} from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { getUser, sendMessage, joinRoom, leaveRoom, getPersonnesRoom, clearContext, getRoom, typing, stopTyping } from '../sockets/emit';
import UIFx from 'uifx';
import SocketContext from '../components/socket_context/context';
import Card from '../components/Card';
import UserText from '../components/UserText';
import Profile from '../components/Profile';
import notifSong from '../data/notification.mp3';
import Message from '../components/Message';
import { animateScroll } from "react-scroll";
import messagesData from '../data/messages.json';

const RoomPage = (props) => {
    const { username, error, newUserMessage, newSystemMessage, users, room, usersTyping } = useContext(SocketContext); //Socket context
    const [loaded, setLoaded] = useState(false); //If page is load
    const [message, setMessage] = useState(); //Message from the chat room (last received)
    const [messages, setMessages] = useState([]); //All messages of the chat
    const [usersShow, setUsers] = useState([]); //All user's component of connected user on this chat room
    const [roomFull, setRoomFull] = useState(); //If room is full when you joined
    const [isTyping, setTyping] = useState(false); //If user is typing
    const [typingUsersText, setTypingUsersText] = useState(); //Show who is typing

    const dong = new UIFx(notifSong); //Generate the notification song

    useEffect(() => {
        if (!error) {
            async function getData() {
                await getRoom(props.match.params.id); //Get room if exist when page load
            }
    
            getData();
        } else {
            if (error !== undefined) { //Only if loaded and error is true
                alert("Fatal error from the server :/");
                clearContext(true);
            }
        }

        //When you leave this chat room
        return () => {
            clearContext(); //Clear all your data except username, error and nbPersonnes connected
        }
    }, [error]);

    //Fired when room is updated
    useEffect(() => {
        if (room != null) { //If room is not undefined or null (loaded from server and exist)
            async function getData() {
                await getUser(); //Get your username from server
                await joinRoom(props.match.params.id); //Say to the server you join this room
                await getPersonnesRoom(props.match.params.id); //Get all users in this room
            }
            
            getData();

            //When you leave this chat room if it exist
            return () => {
                stopTyping();
                leaveRoom(props.match.params.id); //Say to the server you leave this room
            }
        }
    }, [room]);

    //When users is loaded
    useEffect(() => {
        if (users !== undefined && room != null) { //== null mean undefined or null
            if (roomFull === undefined) { //If roomFull is still not set, if  we arrive there we already joinded it so if we go over maximum we left it immediatly
                setRoomFull(Object.keys(users).length > room.params.max_people); //We set it now
                if (Object.keys(users).length > room.params.max_people) { //If we go over the maximum allowed users we show an alert and redirect, we must repeat the condition because of asynchrone
                    alert(messagesData.roomFull);
                } //Else we never come here again
            }
            
            updateUsers(true);
        }
    }, [users, room]);

    //When username is loaded
    useEffect(() => {
        if (username !== undefined) { //undefined if doesn't exist on the server
            setLoaded(true); //Load the page (username will be load after the room object)
        }
    }, [username]);

    //When new message is receive
    useEffect(() => {
        if (newUserMessage !== undefined) {
            dong.play();

            setMessages(oldMsgs => [...oldMsgs, <Message username={newUserMessage.username}>{newUserMessage.message}</Message>]);
        }
    }, [newUserMessage]);

    //Update users of this chat room
    async function updateData() {
        await getPersonnesRoom(props.match.params.id);
        updateUsers();
    }

    //When new message from the system is receive (join or left)
    useEffect(() => {
        if (newSystemMessage !== undefined) {
            setMessages(oldMsgs => [...oldMsgs, <p className="message message-system">{newSystemMessage}</p>]);

            updateData();
        }
    }, [newSystemMessage]);

    //When messages is updated we scroll to the bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        console.log("typing updated");
        if (usersTyping !== undefined) {
            console.log(usersTyping);
            let text = "";
            for(const [user, value] of Object.entries(usersTyping)) {
                if (value) { //User is actually typing
                    if (!text.match(/^$/g)) {
                        text += ", ";
                    }
                    text += user;
                }
            }
            
            setTypingUsersText(text);
        }
    }, [usersTyping]);

    //When you change the value of your message
    const handleMessage = e => {
        const {value} = e.target;
        setMessage(value);

        //Text is empty
        if (value.match(/^$/g)) {
            stopTyping();
        } else {
            if (!isTyping) { //If you are not already typing
                typing();
            }
        }

        setTyping(!value.match(/^$/g));
    }

    //When you press key on the input text
    function handleKeyPress(event) {
        if(event.key === 'Enter'){ //If key is enter
            if (!message.match(/^$/g)) {
                sendMessage(props.match.params.id, message); //Say to the server you send a new message in the room

                setMessages(oldMsgs => [...oldMsgs, <Message username={username} sender={true}>{message}</Message>]); //Add your message to the array because server will not notify you for YOUR message
                setMessage(""); //Clear the input text field
                stopTyping(); //Stop typing because message sent
            }
        }
    }

    //Scroll the scroll bar to bottom
    function scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "messages"
        });
    }

    //Redirect if there is any error
    function renderRedirect() {
        if (room === null || roomFull) { //If room doesn't exist or loaded we go to all rooms page
            return <Redirect to='/rooms' />
        } else {
            if (loaded && (error || username === undefined)) { //In this case we have to login
                return <Redirect to='/' />
            }
        }
    }

    //Go through users and generate component
    function updateUsers() {
        if (users !== undefined) {
            let usersItems = [];

            for (const key of Object.keys(users)) {
                usersItems.push(<UserText username={key} />);
            }
    
            setUsers(usersItems);
        }
    }

    function getMessageTyping() {
        let message = "";
        if (usersTyping !== undefined) {
            let numberUsersTyping = Object.values(usersTyping).filter(Boolean).length;

            if (numberUsersTyping > 0) {
                if (numberUsersTyping > 1) {
                    message = messagesData.areTyping;
                } else {
                    message = messagesData.isTyping;
                }
            }
        }

        return message;
    }

    return (
        <section id="room">
            {renderRedirect()}
            <h1 className="py-5">{messagesData.chatRoomTitle} {room != null ? room.nom : ""}</h1>
            <Link to="/rooms">
                <button className="btn btn-dark">{messagesData.backChatRooms}</button>
            </Link>
            <div className="row">
                <div id="chat" className="col-md-9 mb-5">
                    <Card header={messagesData.chatRoomHeader} footer={messagesData.chatRoomFooter}>
                        <div id="messages">{messages}</div>
                        <input autocomplete="off" type="text" placeholder={messagesData.enterMessage} value={message} onChange={handleMessage} onKeyPress={handleKeyPress} autoFocus={true}/>
                        <p><b>{typingUsersText}</b> {getMessageTyping()}</p>
                    </Card>
                </div>

                <div id="sidebar" className="col-md-3 mb-5">
                    <Profile username={username} room={props.match.params.id} />

                    <Card header={messagesData.chatRoomUsersHeader} footer={messagesData.chatRoomUsersFooter}>
                        {usersShow}
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default withRouter(RoomPage);
