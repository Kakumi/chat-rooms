import { socket } from '.';
import { getNbPersonnes, updatePersonnesRooms } from './emit';

//We define the socketEvents by giving value and setValue to interract with the context's value
//We wait for event from the server and use setValue to update it, web page will change automatically
//...state mean actual state (because value is an object and we want to keep it)

export const socketEvents = ({ value, setValue }) => {
    socket.on('send personnes', (data) => {
        setValue(state => { return { ...state, nbPersonnes: data } });
    });

    socket.on("send user", (data) => {
        setValue(state => { return { ...state, username: data.username } });
    });

    socket.on("new message", (data) => {
        setValue(state => {
            return { ...state, newUserMessage: data } 
        });
    });

    socket.on("new message system", (message) => {
        setValue(state => {
            return { ...state, newSystemMessage: message } 
        });
    });

    socket.on("send personnes rooms", (roomsPers) => {
        setValue(state => {
            return { ...state, roomsPers: roomsPers } 
        });
    })

    socket.on("send personnes room", (users) => {
        setValue(state => {
            return { ...state, users: users } 
        });
    })

    socket.on("clear", () => {
        setValue({
            nbPersonnes: value.nbPersonnes,
            username: value.username,
            error: value.error,
            nbPersonnesRoom: value.nbPersonnesRoom
        });

        getNbPersonnes();
    })

    socket.on("update users rooms", () => {
        updatePersonnesRooms();
    })

    socket.on("send rooms", (rooms) => {
        setValue(state => {
            return { ...state, rooms: rooms } 
        });
    })

    socket.on("send room", (room) => {
        setValue(state => {
            return { ...state, room: room } 
        });
    })

    socket.on("error", () => { //In case of any problem from the server that is important
        setValue(state => {
            return { ...state, error: true } 
        });
    })

    socket.on("typing", (data) => {
        setValue(state => {
            let usersTyping = {};
            
            if (state.usersTyping !== undefined) {
                usersTyping = Object.assign(usersTyping, state.usersTyping); //We clone all the value to update the state with the same value, if we change it directly the useEffect will not update
            }

            usersTyping[data.username] = true;

            return { ...state, usersTyping: usersTyping } 
        });
    });

    socket.on("stop typing", (data) => {
        setValue(state => {
            let usersTyping = {};
            
            if (state.usersTyping !== undefined) {
                usersTyping = Object.assign(usersTyping, state.usersTyping); //We clone all the value to update the state with the same value, if we change it directly the useEffect will not update
            }

            usersTyping[data.username] = false;
            console.log(usersTyping);

            return { ...state, usersTyping: usersTyping } 
        });
    });
};