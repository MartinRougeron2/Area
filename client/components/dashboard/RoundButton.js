import React from "react";

const RoundButton = ({icon}) => {
  return (
    <div className="flex bg-dark rounded-full h-20 w-20 items-center justify-center">
      <img src={icon} />
    </div>
  );
};

export default RoundButton;
