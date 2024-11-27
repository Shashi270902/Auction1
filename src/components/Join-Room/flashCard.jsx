import React from "react";
import styles from "./flashCard.module.css";
const FlashCard = ({ image, name, description, category, startingPrice, status }) => {
  return (
    <div className={styles.flashCard}>
      <img src={image} alt={name} className={styles.flashCardImage} />
      <h2 className={styles.flashCardTitle}>{name}</h2>
      <p className={styles.flashCardDescription}>{description}</p>

      {/* Container for Price and Category */}
      <div className={styles.detailsContainer}>
        <p className={styles.flashCardPrice}>${startingPrice}</p>
        <p className={styles.flashCardCategory}>{category}</p>
      </div>

      <div className={styles.priceStatusContainer}>
        <p
          className={`${styles.flashCardStatus} ${
            status === "Close" ? styles.close : styles.open
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
};
export default FlashCard;