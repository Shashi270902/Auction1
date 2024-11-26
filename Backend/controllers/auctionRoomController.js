const AuctionRoom = require('../models/auctionRoom.model');
const crypto = require('crypto');


// Generate a unique room code
async function generateUniqueRoomCode() {
    let roomCode;
    let roomExists;
    
    do {
        // Generate a 6-character alphanumeric code
        roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        // Check if the room code already exists
        roomExists = await AuctionRoom.findOne({ roomCode: roomCode });
    } while (roomExists);

    return roomCode;
}

// Create a new auction room
exports.createAuctionRoom = async (req, res) => {
    console.log(req.body);
    try {
        const { timelimit, ...otherData } = req.body;
        
        // Generate unique room code
        const roomCode = await generateUniqueRoomCode();
        
        // Calculate end time based on time limit
        const endTime = new Date(Date.now() + timelimit * 1000);
        
        const room = new AuctionRoom({
            ...otherData,
            roomCode,    // Add the generated room code
            timelimit,
            endTime,
        });
        
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Get all auction rooms
exports.getAuctionRooms = async (req, res) => {
    try {
        const auctionRooms = await AuctionRoom.find();
        res.status(200).json(auctionRooms);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single auction room by ID
exports.getAuctionRoomById = async (req, res) => {
    console.log("jbhgb",req.params);
    try {
        const room = await AuctionRoom.findOne({ roomCode: req.params.roomCode });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        // Add server time to the response
        const response = {
            ...room.toObject(),
            serverTime: new Date(),
        };
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an auction room by ID
exports.updateAuctionRoom = async (req, res) => {
    try {
        const auctionRoom = await AuctionRoom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!auctionRoom) {
            return res.status(404).json({ message: 'Auction room not found' });
        }
        res.status(200).json({ message: 'Auction room updated successfully', auctionRoom });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an auction room by ID
exports.deleteAuctionRoom = async (req, res) => {
    try {
        const auctionRoom = await AuctionRoom.findByIdAndDelete(req.params.id);
        if (!auctionRoom) {
            return res.status(404).json({ message: 'Auction room not found' });
        }
        res.status(200).json({ message: 'Auction room deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update the highest bid in an auction room
exports.updateHighestBid = async (req, res) => {
    const { roomCode } = req.params; 
    console.log(roomCode);
    // Using roomId to identify the room
    const { highestBid, highestBidder } = req.body;

    try {
        // Validate input
        if (!highestBid || !highestBidder) {
            return res.status(400).json({ message: "Highest bid and bidder are required." });
        }

        // Ensure the new bid is higher than the current highest bid
        const auctionRoom = await AuctionRoom.findOne({ roomCode: roomCode });
        if (!auctionRoom) {
            return res.status(404).json({ message: "Auction room not found." });
        }
        if (highestBid <= auctionRoom.highestBid) {
            return res.status(400).json({ message: "New bid must be higher than the current highest bid." });
        }

        // Update only the required fields
        const updatedAuctionRoom = await AuctionRoom.findOneAndUpdate(
            { roomCode: roomCode },
            { highestBid, highestBidder },
            { new: true, runValidators: true } // `runValidators` ensures updated fields meet schema requirements
        );

        res.status(200).json({ message: "Highest bid updated successfully.", updatedAuctionRoom });
    } catch (error) {
        console.error("Error updating highest bid:", error);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};

exports.endAuction = async (req, res) => {
    const { roomCode } = req.params;
    const { winner, endTime } = req.body;

    try {
        const updatedRoom = await AuctionRoom.findOneAndUpdate(
            { roomCode: roomCode },
            { 
                auctionEnded: true,
                winner: winner,
                endTime: endTime
            },
            { new: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: "Auction room not found." });
        }

        res.status(200).json({ 
            message: "Auction ended successfully.", 
            room: updatedRoom 
        });
    } catch (error) {
        console.error("Error ending auction:", error);
        res.status(500).json({ 
            message: "Internal server error.", 
            error: error.message 
        });
    }
};
