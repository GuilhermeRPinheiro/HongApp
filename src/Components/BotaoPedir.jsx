// src/Components/BotaoPedir.jsx
import React from 'react'; 

function BotaoPedir({ onClick }) { 
  return (
    <button 
      onClick={onClick}
      className="w-[90px] h-9 px-4 py-2 bg-red-600 rounded-lg shadow-inner border border-red-600 flex justify-center items-center gap-2.5"
    >
      <div className="text-white text-base font-bold font-['Montserrat']">Pedir</div>
    </button>
  );
}

export default BotaoPedir;