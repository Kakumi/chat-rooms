const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const avatars = require("adorable-avatars");
const fs = require("fs");

//We set endpoint /avatars to use adorable avatars as profile icon
app.use('/avatars', avatars);

//Number of connected client
var nbPersonnes = 0;

io.on("connection", socket => {
    //On disconnect
    socket.on('disconnect', () => {
        if (socket.username !== undefined) { //If username exist (logged)
            log("Disconnected (Closing the browser or client)"); //Log as user
            nbPersonnes--; //Remove him from the count

            if (socket.room !== undefined) { //If user has a room
                io.to(socket.room).emit('new message system', socket.username + " has left the chat"); //Notify the room
                logAdmin("(" + socket.room + ") : " + socket.username + " left the chat (Closing the browser or client)"); //Log as admin

                socket.to(socket.room).emit('stop typing', {
                    username: socket.username
                });
                
                let sockets = Object.keys(io.sockets.sockets); //Update users room if there are left
                if (sockets.length > 0) {
                    io.to(sockets[0]).emit("update users rooms"); //Send this event to the first client found (we will send rooms and server will notify all other users from room)
                }
            }
        }
    });

    //User logged
    socket.on('add user', (username) => {
        if (socket.username != null) return; //Username doesn't exist

        socket.username = username; //Store username (linked to his ID)
        nbPersonnes++; //Increment him into the counter

        socket.broadcast.emit("send personnes", nbPersonnes); //Update all connected users counter except ourself because it will be in the client

        log("Login"); //Log as user
    });

    //User logged out
    socket.on('remove user', () => {
        if (socket.username == null) return; //If user exist

        socket.broadcast.emit("send personnes", nbPersonnes); //Update all connected users counter except ourself because it will be in the client

        socket.username = undefined; //Reset username
        socket.leaveAll(); //Leave all rooms
        nbPersonnes--; //Remove him from the counter

        log("Logout"); //Log as user
    });

    //Send username to the client
    socket.on("get user", () => {
        socket.emit("send user", {
            username: socket.username
        })
    });

    //Send counter of connected people to the client
    socket.on("get personnes", () => {
        socket.emit("send personnes", nbPersonnes);
    })

    //Send all username of connected user in the room
    socket.on("get personnes room", (room) => {
        let users = {}; //Must be an object to send it to the server or you will get empty array

        if (io.sockets.adapter.rooms[room] !== undefined) { //If this room exist in the session
            let sockets = io.sockets.adapter.rooms[room].sockets; //Get all sockets (clients)
            for (const [key, value] of Object.entries(sockets)) { //For each of them key = id and value = boolean
                users[io.sockets.connected[key].username] = value; //Store username as key and boolean as value to the array
            }
        }

        socket.emit("send personnes room", users);
    });

    //Authorize the client to clear all the data (to avoid bug)
    socket.on("clear", () => {
        socket.emit("clear");
    });

    //Count how many users are in rooms
    socket.on("get personnes rooms broadcast", () => {
        var roomsPers = {}; //Must be an object to send it to the server or you will get empty array

        fs.readFile("data/rooms.json", (err, rawdata) => { //We open it now to update if there is some change in the file (not implemented for now)
            if (err) {
                logAdmin("Can't access to rooms file");
                socket.emit("error");
            } else {
                let rooms = JSON.parse(rawdata);

                for(let key of Object.keys(rooms)) { //For each room id in the file
                    roomsPers[key] = 0; //Set to 0
                    if (io.sockets.adapter.rooms[key] !== undefined) { //If exist in the session (mean there is at least 1 player)
                        let sockets = io.sockets.adapter.rooms[key].sockets; //Get all clients for this room
                        for (let value of Object.values(sockets)) {
                            if (value) {
                                roomsPers[key]++; //increment him for this room
                            }
                        }
                    }
                }

                //We send it there because it's async and the file can't load
                //Send it to everyone (could be useful in the case of disconnect from browser or server because we use a random user as caller and he must update too)
                io.emit("send personnes rooms", roomsPers);
            }
        });
    });

    //Same as above but for the client
    socket.on("get personnes rooms", () => {
        var roomsPers = {};

        fs.readFile("data/rooms.json", (err, rawdata) => { //We open it now to update if there is some change in the file (not implemented for now)
            if (err) {
                logAdmin("Can't access to rooms file");
                socket.emit("error");
            } else {
                let rooms = JSON.parse(rawdata);

                for(let key of Object.keys(rooms)) { //For each room id in the file
                    roomsPers[key] = 0; //Set to 0
                    if (io.sockets.adapter.rooms[key] !== undefined) { //If exist in the session (mean there is at least 1 player)
                        let sockets = io.sockets.adapter.rooms[key].sockets; //Get all clients for this room
                        for (let value of Object.values(sockets)) {
                            if (value) {
                                roomsPers[key]++; //increment him for this room
                            }
                        }
                    }
                }

                //Send it to the client
                socket.emit("send personnes rooms", roomsPers);
            }
        });
    });

    //User join a room
    socket.on("join room", (room) => {
        if (socket.username != null) { //If username exist (Logged)
            socket.join(room); //Join room
            socket.room = room; //Save it here to use if user disconnect (from browser or server)
            log("Joined the chat \"" + room + "\""); //Log as user

            io.to(room).emit('new message system', socket.username + " has joined the chat"); //Tell everyone in the room a user joined
            logAdmin("(" + room + ") : " + socket.username + " joined the chat"); //Log as admin

            socket.emit("update users rooms"); //Send it to the client
        }
    });

    //User leave room
    socket.on("leave room", (room) => {
        if (socket.username != null) { //If user exist (Logged)
            socket.leave(room); //Leave room
            socket.room = undefined; //Set it to undefined
            log("Left the chat \"" + room + "\""); //Log as user

            io.to(room).emit('new message system', socket.username + " has left the chat"); //Tell everyone in the room a user left
            logAdmin("(" + room + ") : " + socket.username + " left the chat"); //Log as admin

            socket.emit("update users rooms"); //Send it to the client
        }
    });

    //New message sent
    socket.on('send message', (room, message) => {
        if (socket.username != null) { //If username exist
            log("new message (" + room + ") : " + message); //Log as user
            socket.to(room).emit('new message', { //Send the message and author to everyone in the room except the sender
                username: socket.username,
                message: message,
            });
        }
    });

    //Get all rooms
    socket.on('get rooms', () => {
        fs.readFile("data/rooms.json", (err, rawdata) => { //We open it now to update if there is some change in the file (not implemented for now)
            if (err) logAdmin("Can't access to rooms file");
            else {
                let rooms = JSON.parse(rawdata);

                socket.emit('send rooms', rooms);
            }
        });
    });

    //Get specif room
    socket.on('get room', (id) => {
        fs.readFile("data/rooms.json", (err, rawdata) => { //We open it now to update if there is some change in the file (not implemented for now)
            if (err) logAdmin("Can't access to rooms file");
            else {
                let rooms = JSON.parse(rawdata);

                socket.emit('send room', (rooms[id] !== undefined ? rooms[id] : null)); //We return null instead of undefined to know that data is receive but doesn't exist
            }
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        if (socket.username != null && socket.room != null) {
            log("Start typing");
            socket.to(socket.room).emit('typing', {
                username: socket.username
            });
        }
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        log("Stop typing");
        if (socket.username != null && socket.room != null) {
            socket.to(socket.room).emit('stop typing', {
                username: socket.username
            });
        }
    });

    //When user do an action we show it to the console with his ID + username + action
    function log(message) {
        console.log("#" + socket.id + " (" + socket.username + ") => " + message);
    }

    //When we do something important (generally message) we show it to the console with Server + action
    function logAdmin(message) {
        console.log("#Server => " + message);
    }
})

//Tell us to listen on port 8000
server.listen(8000, () => console.log("server is running on port 8000"));