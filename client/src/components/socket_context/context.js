import { createContext } from "react"; 

const SocketContext = createContext({  //We set react context
    nbPersonnes: 0,
    username: '',
    error: false,
    nbPersonnesRoom: 0
}); 

export default SocketContext;