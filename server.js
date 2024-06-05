const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { default: axios } = require("axios");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

let users = [];
let onlineUser = new Set();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log('New client connected', socket.id);
        socket.on('join', (userId) => {
            socket.join(userId);
            onlineUser.add(userId);
            console.log("socket", socket.handshake.auth);
            io.emit("online-user", Array.from(onlineUser));
        });

        socket.emit("get-users", users);
        socket.on("user-store", (userData) => {
            users.push(userData);
            console.log("data stored", users);
        });
        socket.on("send-message", async (currentUserId, id, msg) => {
            console.log("send-message", currentUserId, id, msg);

            axios.post(`${process.env.NEXTAUTH_URL}/api/message/send-message`, { msgSentBy: currentUserId, msgSentTo: id, message: msg })
                .then((res) => {
                    console.log("api/message/send-message", res.data);
                    io.to(currentUserId).emit("message", res.data.conversationData);
                    io.to(id).emit('message', res.data.conversationData);
                })
                .catch((error) => {
                    console.log("error", error);
                });
        });

        socket.on("disconnect", () => {
            console.log("disconnect onlineUser", onlineUser);
            onlineUser.delete(socket.handshake.auth.userId);
            io.emit("online-user", Array.from(onlineUser));
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