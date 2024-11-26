const express = require('express');
const auctionRoomController = require('../controllers/auctionRoomController');
const router = express.Router();


router.post('/create-room', auctionRoomController.createAuctionRoom);
router.get('/auction-rooms', auctionRoomController.getAuctionRooms);
router.get('/auction-rooms/:roomCode', auctionRoomController.getAuctionRoomById);
router.put('/auction-rooms/:roomCode', auctionRoomController.updateHighestBid);
router.put('/auction-rooms/:roomCode/end', auctionRoomController.endAuction);
module.exports = router;