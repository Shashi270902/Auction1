import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";
import herobg from "../../assets/herobg.png";

const Room = () => {
  const { roomId } = useParams();
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("No bids yet");
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [newBid, setNewBid] = useState("");
  const [userName, setUserName] = useState("Anonymous"); // Set a default userName
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState(null); // State for product data
  const [winner, setWinner] = useState(null); // New state to store winner details
  const timerRef = useRef(null);
  const wsRef = useRef(null);
  const [serverTimeDiff, setServerTimeDiff] = useState(0);

  // Debugging roomId
  useEffect(() => {
    console.log("Room ID from useParams:", roomId); // Make sure roomId is not undefined
  }, [roomId]);

  useEffect(() => {
    // Fetch product data from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productData = products[0];
    setProduct(productData);
    // console.log(roomId);

    // Check if roomId is available before setting up WebSocket
    if (!roomId) {
      console.error("Room ID is not available!");
      return;
    }

    // Set up WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8080");
    
    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      // Join the room
      wsRef.current.send(JSON.stringify({
        type: 'joinRoom',
        roomCode: roomId,
        userName
      }));

      // Start time sync
      setInterval(() => {
        wsRef.current.send(JSON.stringify({
          type: 'syncTime',
          roomCode: roomId
        }));
      }, 5000); // Sync every 5 seconds
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'roomState':
          setHighestBid(data.highestBid);
          setHighestBidder(data.highestBidder);
          setTimeLeft(Math.floor(data.timeLeft / 1000));
          setJoinedUsers(data.joinedUsers);
          break;

        case 'bidUpdate':
          setHighestBid(data.bidAmount);
          setHighestBidder(data.userName);
          break;

        case 'timeSync':
          const serverTime = new Date(data.serverTime);
          const clientTime = new Date();
          setServerTimeDiff(serverTime - clientTime);
          setTimeLeft(Math.floor((new Date(data.endTime) - serverTime) / 1000));
          break;
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, userName]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!auctionEnded) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            endAuction();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [auctionEnded]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const placeBid = async () => {
    const bidAmount = parseFloat(newBid);
    if (bidAmount > highestBid) {
      wsRef.current.send(JSON.stringify({
        type: 'newBid',
        roomCode: roomId,
        bidAmount,
        userName
      }));
      setNewBid("");
    } else {
      alert("Bid must be higher than the current highest bid.");
    }
  };

  const endAuction = () => {
    setAuctionEnded(true);
    clearInterval(timerRef.current);
    if (highestBidder !== "No bids yet") {
      setWinner({ name: highestBidder, bid: highestBid });
    }
  };

  return (
    <div 
        className={styles.container}
        style={{
            backgroundImage: `url(${herobg})`,
        }}
    >
        <h1 className={styles.title}>The Treasure Chase – Bid Your Way to the Top!</h1>
        
        <div className={styles.productBox}>
            <div className={styles.topSection}>
                <div className={styles.imageContainer}>
                    {product && <img src={product.image} alt="Product" />}
                </div>
                
                <div className={styles.productDetails}>
                    <h2 className={styles.productTitle}>{product?.title}</h2>
                    <p className={styles.startingPrice}>Starting Price: ${product?.starting_price}</p>
                    <p className={styles.description}>{product?.description}</p>
                    {product?.category && <p>Category: {product.category}</p>}
                    {product?.reserve_price && <p>Reserve Price: ${product.reserve_price}</p>}
                </div>
            </div>

            <div className={styles.middleSection}>
                <div className={styles.timer}>
                    Time Left: {formatTime(timeLeft)}
                </div>
                <div className={styles.highestBid}>
                    Current Highest Bid: ${highestBid}
                </div>
            </div>

            <div className={styles.biddingSection}>
                <input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={newBid}
                    onChange={(e) => setNewBid(e.target.value)}
                    disabled={auctionEnded}
                />
                <button 
                    onClick={placeBid} 
                    disabled={auctionEnded || !newBid}
                >
                    Place Bid
                </button>
            </div>

            <div className={styles.bottomSection}>
                <div className={styles.joinedUsers}>
                    <h4>Joined Users</h4>
                    <ul className={styles.usersList}>
                        {joinedUsers.map((user, index) => (
                            <li key={index}>{user}</li>
                        ))}
                    </ul>
                </div>
                
                <div className={styles.highestBidder}>
                    <h4>Highest Bidder</h4>
                    <p>{highestBidder}</p>
                </div>
            </div>

            <button 
                className={styles.endAuctionBtn}
                onClick={endAuction} 
                disabled={auctionEnded}
            >
                End Auction
            </button>
        </div>

        {auctionEnded && winner && (
            <div className={styles.auctionEnded}>
                Auction Ended! Winner: {winner.name} with a bid of ${winner.bid}
            </div>
        )}
        {auctionEnded && !winner && (
            <div className={styles.auctionEnded}>No winner declared!</div>
        )}
    </div>
  );
};

export default Room;
