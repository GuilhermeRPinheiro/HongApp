// src/Components/StarRating.js
function StarRating({ rating, onRatingChange, maxRating = 5, readOnly = false }) {
  const stars = []

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span
        key={i}
      
        className={`
          ${i <= rating ? 'text-yellow-400' : 'text-gray-400'} 
          ${readOnly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-500'}
        `}
        
        onClick={() => !readOnly && onRatingChange(i)}
        style={{ fontSize: '1.2em' }} 
      >
        ★ 
      </span>
    );
  }

  return <div className="flex items-center">{stars}</div>
}

export default StarRating