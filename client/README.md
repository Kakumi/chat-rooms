This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and based on [Socket.io](https://socket.io/).

## How to start

### Dependencies

You have to install on your computer :
1. [npm & node.js](https://www.npmjs.com/get-npm)

### Server

At first, you have to use this command at the root of the folder
```npm install```

When you have successly installed all the packages you can start your server, it will be launch on the port **8000**
```npm start```

You could get a successful message

### Client

At first, you have to use this command in the "client" folder
```npm install```

When you have successly installed all the packages you can start your client, it will be launch on the port **3000**
```npm start```

After a few seconds your favourite browser will open your website

## How it works
When your server starts it will be waiting for an event from the clients.
When you are on your client, I use the React Context to create the connection to the server, then I set my events in **events.js** and my requests to the servers in **emit.js**. When I need a response from the server I will send a request that asks the server to process the information. The server will emit an event at the end of the processing that the client(s) will intercept and store the data in the Context. React will use the useEffect to update the components and display the content in real time. For more information you can find the documentation in the code or on the documentation of [React](https://en.reactjs.org/docs/getting-started.html) and [Socket.io](https://socket.io/docs/).

## Copyright
You can use this code as you want