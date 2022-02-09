import React from "react";

const DashHeader = () => {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <p className="text-lg font-bold">DashBoard</p>
      <div className="flex flex-col">
        <p className="font-semibold">Username</p>
        <p className="text-black opacity-50">Adress e-mail</p>
      </div>
    </div>
  );
};

export default DashHeader;
