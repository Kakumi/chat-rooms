import { socket } from ".";

//We create a lot of function to send an event to the server

export const getNbPersonnes = () => {
    socket.emit('get personnes');
};

export const getUser = () => {
    socket.emit('get user');
}

export const addUser = (username) => {
    socket.emit('add user', username);
}

export const removeUser = (room) => {
    if (room) {
        leaveRoom(room);
    }
    clearContext(true);
    socket.emit('remove user');
}

export const sendMessage = (room, message) => {
    socket.emit('send message', room, message);
}

export const joinRoom = (room) => {
    socket.emit('join room', room);
}

export const leaveRoom = (room) => {
    socket.emit('leave room', room);
}

export const getPersonnesRoom = (room) => {
    socket.emit('get personnes room', room);
}

export const getNbPersonnesRooms = () => {
    socket.emit('get personnes rooms');
}

export const updatePersonnesRooms = () => {
    socket.emit("get personnes rooms broadcast");
}

export const clearContext = () => {
    socket.emit("clear");
}

export const getRooms = () => {
    socket.emit("get rooms");
}

export const getRoom = (roomId) => {
    socket.emit("get room", roomId);
}

export const typing = () => {
    socket.emit("typing");
}

export const stopTyping = () => {
    socket.emit("stop typing");
}