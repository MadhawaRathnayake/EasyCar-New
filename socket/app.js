import { Server } from "socket.io"

// const io = new Server({
//     cors: {
//         origin: "https://easycar.onrender.com",
//     },
// });

const io = new Server({
    cors: {
        // remove trailing slash and restrict to the client origin
        origin: "https://easycar-hair.onrender.com/",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
    const userExcist = onlineUsers.find((user) => user.userId === userId);
    if (!userExcist) {
        onlineUsers.push({ userId, socketId })
    }
}

const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return onlineUsers.find(user => user.userId === userId)
}

io.on("connection", (socket) => {


    console.log('Socket connected:', socket.id);

    socket.on("newUser", (userId) => {
        addUser(userId, socket.id);
        console.log(onlineUsers);
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
        const receiver = getUser(receiverId)
        io.to(receiver.socketId).emit("getMessage", data);
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
});

const PORT = 4000;

try {
    io.listen(PORT);
    console.log(`Socket server listening on port ${PORT}`);
} catch (err) {
    console.error('Failed to start socket server:', err);
    process.exit(1);
}

// Log low-level engine connection errors
if (io.engine) {
    io.engine.on('connection_error', (err) => {
        console.error('Engine connection error:', err);
    });
}

// If the underlying http server is available, log incoming HTTP requests
const httpServer = io.httpServer;
if (httpServer) {
    httpServer.on('request', (req, res) => {
        console.log('HTTP request ->', req.method, req.url, 'Origin:', req.headers.origin || req.headers.referer);
    });
}

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});