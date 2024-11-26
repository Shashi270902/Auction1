const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Furniture', 'Art', 'Collectibles', 'Fashion', 'Other'], 
    },
    starting_price: {
      type: Number,
      required: true,
      min: 0,
    },
    reserve_price: {
      type: Number,
      required: false, 
      min: 0,
    },
    current_bid: {
      type: Number,
      default: 0,
      min: 0,
    },
    seller: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'sold', 'unsold'],
      default: 'pending',
    },
    room_id: {
      type: String,
    //   required: true,
    },
  
    bids: [{
        user_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bid_amount: {
            type: Number,
            required: true,
        },
        bid_time: {
            type: Date,
            default: Date.now,
        },
    }],
    auction_room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuctionRoom',
      default: null
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
