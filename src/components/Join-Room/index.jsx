// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./styles.module.css";
// import herobg from "../../assets/herobg.png"; // Background image from CreateAuctionRoom
// import Tilt from 'react-parallax-tilt';  // Import the Tilt component

// const JoinRoom = () => {
//   // const [roomCode, setRoomCode] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       const response = await axios.post("/api/auction/join", {
//         roomCode,
//         password,
//       });

//       if (response.data.success) {
//         navigate(`/auction-room/${roomCode}`);
//       } else {
//         setError(response.data.message || "Invalid room code or password");
//       }
//     } catch (err) {
//       setError("Error joining the room. Please try again later.");
//       console.error(err);
//     }
//   };

//   return (
//     <div
//       className={styles.room_container}
//       style={{
//         backgroundImage: `url(${herobg})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className={styles.create_room_container}>
//         <h1 className={styles.header}>Join Auction Room</h1>
//         <form onSubmit={handleSubmit} className={styles.form_container}>
//           {/* Room Code Input */}
//           <div className={styles.input_group}>
//             <Tilt
//               className={styles.input_container}
//               options={{
//                 max: 10,
//                 scale: 1.05,
//                 speed: 400,
//               }}
//             >
//               <label>
//                 Room Code:
//                 <input
//                   type="text"
//                   name="roomCode"
//                   value={roomCode}
//                   onChange={(e) => setRoomCode(e.target.value)}
//                   required
//                   className={styles.input}
//                 />
//               </label>
//             </Tilt>
//           </div>

//           {/* Password Input */}
//           <div className={styles.input_group}>
//             <Tilt
//               className={styles.input_container}
//               options={{
//                 max: 10,
//                 scale: 1.05,
//                 speed: 400,
//               }}
//             >
//               <label>
//                 Password:
//                 <input
//                   type="password"
//                   name="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className={styles.input}
//                 />
//               </label>
//             </Tilt>
//           </div>

//           {/* Error Message */}
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           {/* Submit Button */}
//           <div className={styles.submit_btn_container}>
//             <button type="submit" className={styles.submit_btn}>
//               Join Room
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JoinRoom;

// //-------------------------------------------------------


import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import herobg from "../../assets/herobg.png";
import FlashCard from "./flashCard";

const JoinRoom = () => {
  const [products, setProducts] = useState([]); // State for storing products
  const [loading, setLoading] = useState(true); // State for loader
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the database
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data); // Assuming the API returns an array of products
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Run once when the component mounts

  if (loading) {
    return <div className={styles.loader}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
        <div className={styles.flash_card_container}>
          {/* Render FlashCard components for each product */}
          {products.map((product) => (
            <FlashCard
              key={product._id} // Ensure the backend provides a unique ID for each product
              image={product.image}
              name={product.title}
              description={product.description}
              category={product.category}
              startingPrice={product.starting_price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
