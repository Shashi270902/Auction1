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

  // Debugging roomId
  useEffect(() => {
    console.log("Room ID from useParams:", roomId); // Make sure roomId is not undefined
  }, [roomId]);

  useEffect(() => {
    // Fetch product data from localStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productData = products[0];
    // setProduct(productData);
    // console.log(roomId);

    // Check if roomId is available before setting up WebSocket
    if (!roomId) {
      console.error("Room ID is not available!");
      return;
    }

    // Set up WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8080");
    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      // Notify server of the new user joining
      wsRef.current.send(
        JSON.stringify({
          type: "newUser",
          userName,
          roomId, // Make sure roomId is included here
        })
      );
    };
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "newBid" && data.roomId === roomId) {
        setHighestBid(data.bidAmount);
        setHighestBidder(data.userName);
      } else if (data.type === "newUser") {
        setJoinedUsers((prevUsers) => [...prevUsers, data.userName]);
      }
    };
    wsRef.current.onclose = () => console.log("WebSocket connection closed");

    return () => wsRef.current.close();
  }, [roomId, userName]); // Adding userName here to ensure it's initialized

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        // console.log(roomId);
        if (!roomId) {
          console.error("Room ID is not defined for API request!");
          return;
        }
        
        const response = await fetch(`http://localhost:8080/api/auction/auction-rooms/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setHighestBid(data.highestBid || 0);
          setHighestBidder(data.highestBidder || "No bids yet");
          setJoinedUsers(data.joinedUsers || []);
          setTimeLeft(data.timelimit || 0);
          setPassword(data.password || "");
          setProduct(data.products[0] || null);
        } else {
          console.error("Failed to fetch auction data. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctionData();
  }, [roomId]); // Ensure roomId is available before making the request

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
      try {
        const response = await fetch(`http://localhost:8080/api/auction/auction-rooms/${roomId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ highestBid: bidAmount, highestBidder: userName }),
        });

        if (response.ok) {
          setHighestBid(bidAmount);
          setHighestBidder(userName || "Anonymous");
          wsRef.current.send(
            JSON.stringify({
              type: "newBid",
              bidAmount,
              userName,
              roomId, // Send roomId with the bid
            })
          );
        } else {
          console.error("Failed to update bid on server.");
        }
      } catch (error) {
        console.error("Error placing bid:", error);
      }
    } else {
      alert("Bid must be higher than the current highest bid.");
    }
    setNewBid("");
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
