import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import herobg from "../../assets/herobg.png"; // Background image from CreateAuctionRoom
import Tilt from 'react-parallax-tilt';  // Import the Tilt component

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/auction/join", {
        roomCode,
        password,
      });

      if (response.data.success) {
        navigate(`/auction-room/${roomCode}`);
      } else {
        setError(response.data.message || "Invalid room code or password");
      }
    } catch (err) {
      setError("Error joining the room. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div
      className={styles.room_container}
      style={{
        backgroundImage: `url(${herobg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.create_room_container}>
        <h1 className={styles.header}>Join Auction Room</h1>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          {/* Room Code Input */}
          <div className={styles.input_group}>
            <Tilt
              className={styles.input_container}
              options={{
                max: 10,
                scale: 1.05,
                speed: 400,
              }}
            >
              <label>
                Room Code:
                <input
                  type="text"
                  name="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  required
                  className={styles.input}
                />
              </label>
            </Tilt>
          </div>

          {/* Password Input */}
          <div className={styles.input_group}>
            <Tilt
              className={styles.input_container}
              options={{
                max: 10,
                scale: 1.05,
                speed: 400,
              }}
            >
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </label>
            </Tilt>
          </div>

          {/* Error Message */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Submit Button */}
          <div className={styles.submit_btn_container}>
            <button type="submit" className={styles.submit_btn}>
              Join Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
