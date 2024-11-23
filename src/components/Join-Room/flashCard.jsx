// export default FlashCard;
import React from "react";
import styles from "./flashCard.module.css";

const FlashCard = ({ image, name, description, category, startingPrice }) => {
  return (
    <div className={styles.flashCard}>
      <img src={image} alt={name} className={styles.flashCardImage} />
      <h2 className={styles.flashCardTitle}>{name}</h2>
      <p className={styles.flashCardDescription}>{description}</p>
      <p className={styles.flashCardCategory}>{category}</p>
      <p className={styles.flashCardPrice}>${startingPrice}</p>
    </div>
  );
};

export default FlashCard;
