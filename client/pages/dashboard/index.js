import React from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashServiceWidget from "../../components/dashboard/DashServiceWidget";
import DashSideBar from "../../components/dashboard/DashSideBar";
import DropDown from "../../components/dashboard/DropDown";
import RoundButton from "../../components/dashboard/RoundButton";
import MainButton from "../../components/utils/MainButton";

const ACTIONLIST = [
  {
    name: "Action 1",
  },
  {
    name: "Action 2",
  },
  {
    name: "Action 3",
  },
];

const DashboardPage = () => {
  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-center text-lg font-bold">Make a Bay</h2>
        <div className="flex flex-row justify-between items-center w-full h-[50%] mt-3">
          <DashServiceWidget text={"Séléctionez une application"} />
          <RoundButton icon={"/assets/Images/plus.svg"}/>
          <DashServiceWidget text={"Sélectionnez en une autre"} />
        </div>
        <div className="bg-white w-full drop-shadow-md mt-8 p-5">
          <h2 className="text-md font-medium">Selectionnez une action</h2>
          <div className="flex flex-row w-full justify-around items-center">
            <DropDown actionlist={ACTIONLIST}/>
            <RoundButton icon={"/assets/Images/arrow-right.svg"}/>
            <DropDown actionlist={ACTIONLIST}/>
          </div>
        </div>
        <div className="flex w-80 mt-10">
          <MainButton text="Make a Bay"/>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
