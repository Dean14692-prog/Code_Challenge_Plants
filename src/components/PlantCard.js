import React from "react";

function PlantCard({ plant, onToggleStock }) {
  const { id, name, image, price, soldOut } = plant;

  return (
    <li className="card">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <p>Price: ${price}</p>
      <button
        className={soldOut ? "primary" : "secondary"}
        onClick={() => onToggleStock(id)}
      >
        {soldOut ? "Out of Stock" : "In Stock"}
      </button>
    </li>
  );
}

export default PlantCard;
