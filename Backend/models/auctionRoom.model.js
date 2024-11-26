const mongoose = require('mongoose');

const auctionRoomSchema = new mongoose.Schema({
    auction_Type: {
        type: String,
        required: true,
        enum: ['open', 'closed'], 
    },
    numberOfMembers: {
        type: Number,
        required: true,
        min: 2, 
    },
    registration_Number: {
        type: String,
        required: true,
        
    },
    timelimit: {
        type: Number,
        required: true,
        default: 1800, 
    },
    endTime: {
        type: Date,
        required: true,
    },
    minbid_increment: {
        type: Number,
        required: true,
        min: 1, 
    },
    start_time: {
        type: Date,
        required: true,
        default: Date.now, 
    },
    room_password: {
        type: String,
        required: true,
    },
    roomCode: {
        type: String,
        required:true,
        unique: true,
    },
    winner: {
        type: String,
        default: null
    },
    highestBid: {
        type: Number,
        default: 0,
    },
    highestBidder: {
        type: String,
        default: "No bids yet",
    },
    joinedUsers: {
        type: [String], // Array of usernames
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    auctionEnded: {
        type: Boolean,
        default: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    finalBid: {
        type: Number,
        default: 0
    },
});

const AuctionRoom = mongoose.model('AuctionRoom', auctionRoomSchema);
module.exports = AuctionRoom;
