const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let users = [];

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log('New client connected', socket.id);
        socket.emit("get-users", users);
        socket.on("send-meesgae", (message, senderName, reciverName, callback) => {
            console.log("send-meesgae", message, reciverName);
            users.map((data) => {
                if (data.name === senderName) {
                    return data.messages.push({
                        message: message,
                        isSeened: false,
                        reciverName: reciverName,
                        senderId: socket.id,
                    });
                } 
                return data
            });
            console.log("usersss",users);
            callback({ status: "OK", data: users });
        });
        socket.on("user-store", (userData) => {
            users.push(userData);
            console.log("data stored", users);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});

// const ioHandler = (req, res) => {
//     console.log('*First use, starting Socket.IO');
//     // if (!res.socket.server.io) {
//     //     const io = new Server(res.socket.server);

//     //     // Listen for connection events
//     //     io.on('connection', (socket) => {
//     //         console.log(`Socket ${socket.id} connected.`);

//     //         // Listen for incoming messages and broadcast to all clients
//     //         socket.on('message', (message) => {
//     //             io.emit('message', message);
//     //         });

//     //         // Clean up the socket on disconnect
//     //         socket.on('disconnect', () => {
//     //             console.log(`Socket ${socket.id} disconnected.`);
//     //         });
//     //     });
//     //     res.socket.server.io = io;
//     // }
//     res.end();
// };

// module.exports = ioHandler;