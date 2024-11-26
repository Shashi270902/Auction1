import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import herobg from "../../assets/herobg.png";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${herobg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.header}>
        <h1>Products Management</h1>
        <button
          className={styles.addButton}
          onClick={() => navigate("/add-product")}
        >
          Add New Product
        </button>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Category: {product.category}</p>
              <p>Starting Price: ${product.starting_price}</p>
              <p>Status: {product.status}</p>
              {product.room_id && (
                <p>Auction Room: {product.room_id}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 