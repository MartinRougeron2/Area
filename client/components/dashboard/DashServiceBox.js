import React from "react";

const DashServiceBox = ({ id, icon, action, selected }) => {
  return (
    <div
      className={`flex items-center justify-center h-28 w-28 bg-${
        selected === id ? "dark" : "white"
      } drop-shadow-md rounded-lg ml-2 mt-3 cursor-pointer p-2 max-w-[40%] max-h-[20%]`}
      onClick={() => action(id)}
    >
      <img className="w-full" src={icon} />
    </div>
  );
};

export default DashServiceBox;
