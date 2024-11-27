import React from "react";
import styles from "./flashCard.module.css";

const FlashCard = ({ image, name, description, category, startingPrice, status, title, handleButtonClick }) => {
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
        <div className={styles.statusButtonContainer}>
          {/* Status */}
          <p
            className={`${styles.flashCardStatus} ${status === "Close" ? styles.close : styles.open
              }`}
          >
            {status}
          </p>

          {/* View Details Button */}
          <button
            className="joinButton mt-4 bg-transparent border border-blue-500 py-2 px-4 text-lg rounded-lg hover:bg-[#4b2b8f] hover:text-white transition"
            aria-label={`View details about ${title}`}
          >
            Join Now
          </button>


        </div>
      </div>
    </div>
  );
};

export default FlashCard;
