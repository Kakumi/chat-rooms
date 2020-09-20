import React, { useState, useEffect } from "react";
import SocketContext from "./context";
import { initSockets } from "../../sockets";

const SocketProvider = (props) => {
    const [value, setValue] = useState({ //Define all default value for the app
        nbPersonnes: 0,
        username: '',
        error: false,
        nbPersonnesRoom: 0
    });

    useEffect(() => initSockets({ value, setValue }), []); //Init socket's session, we send value and setValue to allow function to access them and update

    //We include the provider for your app
    return(
        <SocketContext.Provider value={ value }>
            { props.children }
        </SocketContext.Provider>
    )
};
export default SocketProvider;