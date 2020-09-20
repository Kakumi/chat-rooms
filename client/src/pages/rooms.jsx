import React, {useState, useEffect, useContext} from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { getUser, getNbPersonnes, getNbPersonnesRooms, getRooms, clearContext } from '../sockets/emit';
import SocketContext from '../components/socket_context/context';
import Card from '../components/Card';
import messages from '../data/messages.json';
import Room from '../components/Room';
import Profile from '../components/Profile';

const RoomsPage = (props) => {
    const { nbPersonnes, username, error, roomsPers, rooms } = useContext(SocketContext); //we get the context
    const [loaded, setLoaded] = useState(false); //Load page when data is fetch from the server
    const [roomsComponent, setRoomsComponent] = useState([]); //Used to generate all rooms component

    useEffect(() => { //Fired at the first time and when error change
        if (!error) {
            async function getData() {
                await getUser(); //get username
                await getRooms(); //get available rooms from server
                await getNbPersonnes(); //get number of people connected
                await getNbPersonnesRooms(); //get number of people in rooms
            }
    
            getData();
        } else {
            if (error !== undefined) { //Only if loaded and error is true
                alert("Fatal error from the server :/");
                clearContext(true);
            }
        }
    }, [error]);

    useEffect(() => {
        if (username !== undefined) { //undefined if the username doesn't exist on the server
            setLoaded(true); //Load the page
        }
    }, [username]);

    useEffect(() => {
        if (rooms != undefined) {
            updateRooms(true);
        }
    }, [rooms]);

    useEffect(() => {
        if (roomsPers !== undefined) { //undefined if the roomsPers not loaded
            updateRooms(true); //To update users counter on rooms
        }
    }, [roomsPers]);

    function renderRedirect() {
        if (loaded && (error || username === undefined)) { //If not connected to the server or username doesn't exist
            return <Redirect to='/' /> //Redirect to home page
        }
    }

    //Generate rooms component
    function updateRooms() {
        if (rooms !== undefined) { //To be sure data is loaded
            let roomsItems = [];
            for (const [key, value] of Object.entries(rooms)) {
                //Add at the end of the array a DOM element Room with id of the room, room object and number of users in the room
                roomsItems.push(<Room id={key} room={value} users={roomsPers !== undefined && roomsPers[key] !== undefined ? roomsPers[key] : 0} />);
            }
    
            setRoomsComponent(roomsItems); //store it to rooms object
        }
    }

    /* Show an update button - removed because should be update all the time now
    async function updateRoomsData() {
        await getNbPersonnesRooms();
        updateRooms(true);
    }

    <button onClick={updateRoomsData} className="btn btn-info my-3">{messages.update}</button>
    */
    return (
        <section id="rooms">
            {renderRedirect()}
            <h1 className="py-5">{messages.roomsTitle}</h1>
            <div className="row">
                <div id="all-rooms" className="col-md-9 mb-5">
                    <Card header={messages.roomsHeader} footer={messages.roomsFooter}>
                        {roomsComponent}
                    </Card>
                </div>

                <div id="sidebar" className="col-md-3 mb-5">
                    <Profile username={username} />

                    <div id="infos">
                        <Card header={messages.infosHeader} footer={messages.infosFooter}>
                            <p>{nbPersonnes} {messages.connected}{nbPersonnes > 1 ? "s" : ""}.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default withRouter(RoomsPage);
