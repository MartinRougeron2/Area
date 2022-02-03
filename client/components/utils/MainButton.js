import React from 'react'

const MainButton = ({ text, action, color = "dark", disable = false}) => {
  return (
    <div
      onClick={disable == false ? action : null}
      className={`bg-${color} flex justify-center px-10
      py-3 rounded drop-shadow-lg ${disable ? "cursor-not-allowed opacity-20" : "cursor-pointer hover:bg-white hover:text-" + color} text-white border-${color} border-4`}
    >
      <span className="font-sans font-bold">{text}</span>
    </div>
  );
};


export default MainButton