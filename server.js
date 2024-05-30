const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
            return next(new Error("invalid username"));
        }
        socket.username = username;
        next();
    });

    io.on("connection", (socket) => {
        console.log('New client connected', socket.id);
        socket.on("request", (arg1, callback) => {
            console.log("arg1", arg1);
            callback("bbbbb")
        });
        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
            users.push({
                userID: id,
                username: socket.username,
            });
        }
        socket.emit("users", users);
        socket.broadcast.emit("user connected", {
            userID: socket.id,
            username: socket.username,
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