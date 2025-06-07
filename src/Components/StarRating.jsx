// src/Components/StarRating.js
import React from 'react';

function StarRating({ rating, onRatingChange, maxRating = 5, readOnly = false }) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span
        key={i}
        // Aplica estilo com base se a estrela está preenchida ou vazia
        className={`
          ${i <= rating ? 'text-yellow-400' : 'text-gray-400'} 
          ${readOnly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-500'}
        `}
        // Se não for readOnly, o clique dispara a função onRatingChange
        onClick={() => !readOnly && onRatingChange(i)}
        style={{ fontSize: '1.2em' }} // Tamanho da estrela, ajuste conforme necessário
      >
        ★ {/* Caractere Unicode de estrela preenchida. Para estrela vazia: ☆ */}
      </span>
    );
  }

  return <div className="flex items-center">{stars}</div>;
}

export default StarRating;