const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const main = require('./db');
const registerRouter = require('./routes/user.registerRoute');
const loginRouter = require('./routes/user.loginRoute');
const auctionRoomRoutes = require('./routes/auctionRoomRoute');
const productRoutes = require('./routes/productRoutes');
const AuctionRoom = require('./models/auctionRoom.model'); // Add AuctionRoom model
const Product = require('./models/product.model'); // Add Product model

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auction', auctionRoomRoutes);
app.use('/login', loginRouter);
app.use('/signup', registerRouter);
app.use('/api', productRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to the Auction System API!");
});

// Create a map to store room-specific connections
const roomConnections = new Map();

// WebSocket Connection Handling
wss.on('connection', (ws) => {
  console.log('Client connected');
  let clientRoomCode = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);

      switch (data.type) {
        case 'joinRoom':
          clientRoomCode = data.roomCode;
          if (!roomConnections.has(clientRoomCode)) {
            roomConnections.set(clientRoomCode, new Set());
          }
          roomConnections.get(clientRoomCode).add(ws);

          // Fetch current room state and send to the new client
          const room = await AuctionRoom.findOne({ roomCode: clientRoomCode });
          if (room) {
            ws.send(JSON.stringify({
              type: 'roomState',
              roomCode: clientRoomCode,
              highestBid: room.highestBid,
              highestBidder: room.highestBidder,
              timeLeft: Math.max(0, new Date(room.endTime) - new Date()),
              joinedUsers: room.joinedUsers
            }));
          }
          break;

        case 'newBid':
          // Update the database
          await AuctionRoom.findOneAndUpdate(
            { roomCode: data.roomCode },
            { 
              highestBid: data.bidAmount,
              highestBidder: data.userName
            }
          );

          // Broadcast to all clients in the same room
          if (roomConnections.has(data.roomCode)) {
            roomConnections.get(data.roomCode).forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'bidUpdate',
                  roomCode: data.roomCode,
                  bidAmount: data.bidAmount,
                  userName: data.userName,
                  timestamp: new Date()
                }));
              }
            });
          }
          break;

        case 'syncTime':
          if (roomConnections.has(data.roomCode)) {
            const room = await AuctionRoom.findOne({ roomCode: data.roomCode });
            if (room) {
              roomConnections.get(data.roomCode).forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'timeSync',
                    roomCode: data.roomCode,
                    serverTime: new Date(),
                    endTime: room.endTime,
                    timeLeft: Math.max(0, new Date(room.endTime) - new Date())
                  }));
                }
              });
            }
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (clientRoomCode && roomConnections.has(clientRoomCode)) {
      roomConnections.get(clientRoomCode).delete(ws);
      if (roomConnections.get(clientRoomCode).size === 0) {
        roomConnections.delete(clientRoomCode);
      }
    }
  });
});

// Global error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
  try {
    await main();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
  }
});
