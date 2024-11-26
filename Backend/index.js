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

// WebSocket Connection Handling
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // Make sure to forward the roomCode with the message
        client.send(JSON.stringify({
          type: data.type,
          roomCode: data.roomCode,
          bidAmount: data.bidAmount,
          userName: data.userName,
          winner: data.winner
        }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
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
