import io from "socket.io-client";
import { socketEvents } from "./events";
import { getNbPersonnes } from "./emit";

//Connect to the server
export const socket = io.connect('/'); //io()

//Init the session
export const initSockets = ({ value, setValue }) => {
    setValue({error: socket == null}); //We store if there is an error
    socketEvents({ value, setValue }); //We init events
    getNbPersonnes(); //We ask to the server the number of users
};