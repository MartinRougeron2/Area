import React from "react";
import MainButton from "../utils/MainButton";

const DashSideBar = () => {
  return (
    <div className="drop-shadow-md bg-white p-10 w-[18%] h-[80%] rounded-r-lg">
      <div className="flex flex-col h-[40%] justify-between">
        <h1 className="text-xl text-dark font-bold">AreaBay</h1>
        <MainButton text="Make a Bay" />
        <h2 className="text-lg text-black font-medium">Button</h2>
      </div>
    </div>
  );
};

export default DashSideBar;
