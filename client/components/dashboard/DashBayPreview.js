import React, { useState } from "react";
import DashServiceBox from "./DashServiceBox";
import RoundButton from "../../components/dashboard/RoundButton";
import Switch from "react-switch";
import { BsThreeDotsVertical } from "react-icons/bs";
import { EditText } from "react-edit-text";

const DashBayPreview = ({ bay }) => {
  const { data, from, to } = bay;
  const [activated, setActive] = useState(data.active);

  const switchClick = (check) => {
    setActive(check);
  };

  const changeName = (value) => {
    //TODO SAVE NEW NAME
  };

  const triggerEdit = () => {
    //TODO EDIT
  };

  return (
    <div className="flex flex-row w-full h-[15%] drop-shadow-lg bg-white rounded p-5 mb-5 justify-between">
      <div className="flex flex-row items-center w-[15%]">
        <img className="w-full" src={from.service.icon} />
        <div className="flex bg-dark rounded-full w-[50%] items-center justify-center">
          <img src={"/assets/Images/arrow-right.svg"} />
        </div>
        <img className="w-full" src={to.service.icon} />
      </div>
      <div className="flex items-center" style={{whiteSpace: 'nowrap'}}>
        <span className="text-sm">
          <EditText
            defaultValue={data.description}
            style={{border: "1px solid #ccc" }}
            onSave={changeName}
            inline
          />
        </span>
      </div>
      <div className="flex justify-center items-center content-center">
        <div className="flex mr-2">
          <Switch
            checked={activated}
            onChange={switchClick}
            uncheckedIcon={false}
          />
        </div>
        <div className="flex cursor-pointer" onClick={triggerEdit}>
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DashBayPreview;
