import React from "react";
import MainButton from "../utils/MainButton";
import { GiPirateSkull, GiPirateCoat } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa"
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const DashSideBar = () => {
  return (
    <div className="drop-shadow-md bg-white p-10 w-[25%] h-screen rounded-r-lg">
      <div className="flex flex-col h-[40%] justify-between md:hidden">
        <h1 className="text-xl text-dark font-bold">AreaBay</h1>
        <MainButton text="Make a Bay" action={() => location.href = "/dashboard"}/>
        <h2 className="text-lg text-black font-medium cursor-pointer" onClick={() => location.href = "/dashboard/bays"}>My Bays</h2>
        <h2 className="text-lg text-black font-medium cursor-pointer" onClick={() => location.href = "/faq"}>FAQ</h2>
        <h2 className="text-lg text-black font-medium cursor-pointer" onClick={() => location.href = "/settings"}>Settings</h2>
        <h2 className="text-lg text-black font-medium cursor-pointer fixed bottom-0" onClick={() => {cookies.remove('x-token'); location.reload()}}>Log out</h2>
      </div>
      <div className="flex flex-col h-[40%] justify-between hidden md:block">
        <h1 className="text-lg text-dark font-bold">AreaBay</h1>
        <MainButton text="Make a Bay" action={() => location.href = "/dashboard"}/>
        <GiPirateSkull className="w-full h-[10%] cursor-pointer mt-2" onClick={() => location.href = "/dashboard/bays"}/>
        <FaQuestion className="w-full h-[10%] cursor-pointer mt-2" onClick={() => location.href = "/faq"}/>
        <GiPirateCoat className="w-full h-[10%] cursor-pointer mt-2" onClick={() => location.href = "/settings"}/>
        <FiLogOut className="w-full h-[10%] cursor-pointer fixed bottom-0 mt-2" onClick={() => {cookies.remove('x-token'); location.reload()}}/>
      </div>
    </div>
  );
};

export default DashSideBar;
