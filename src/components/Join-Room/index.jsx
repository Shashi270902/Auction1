import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import FlashCard from "./flashCard";

const JoinRoom = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
                     
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const sortedProducts = response.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setProducts(sortedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className={styles.loader}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.room_container}>
      <div className={styles.create_room_container}>
        <div className={styles.header_container}>
          <h1 className={styles.header}>Join Auction Room</h1>
          <input
            type="text"
            placeholder="Enter Passkey"
            className={styles.input_field}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className={styles.input_field}
          />
          <input
            type="text"
            placeholder="Search..."
            className={styles.input_field}
          />
        </div>

        <div className={styles.flash_card_container}>
          {products.map((product) => (
            <FlashCard
              key={product._id}
              image={product.image}
              name={product.title}
              description={product.description}
              category={product.category}
              startingPrice={product.starting_price}
              status={product.status} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;




















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "./styles.module.css";
// import herobg from "../../assets/herobg.png";
// import FlashCard from "./flashCard";

// const JoinRoom = () => {
//   const [products, setProducts] = useState([]); // State for storing products
//   const [loading, setLoading] = useState(true); // State for loader
//   const [error, setError] = useState(null); // State for error

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/products");
//         // Sort products by date (assuming there's a createdAt field) and take last 10
//         const sortedProducts = response.data
//           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//           .slice(0, 10);
//         setProducts(sortedProducts);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError("Failed to load products. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []); // Run once when the component mounts

//   if (loading) {
//     return <div className={styles.loader}>Loading products...</div>;
//   }

//   if (error) {
//     return <div className={styles.error}>{error}</div>;
//   }

//   return (
//     <div className={styles.room_container}>
//       <div className={styles.create_room_container}>
//         <h1 className={styles.header}>Join Auction Room</h1>
//         <div className={styles.flash_card_container}>
//           {products.map((product) => (
//             <FlashCard
//               key={product._id}
//               image={product.image}
//               name={product.title}
//               description={product.description}
//               category={product.category}
//               startingPrice={product.starting_price}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoinRoom;
