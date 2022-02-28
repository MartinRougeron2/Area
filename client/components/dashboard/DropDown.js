import React, { useState } from "react";

const DropDown = ({ actionlist, value, onChange, placeHolder = "" }) => {
  const [activate, setActivate] = useState(false);

  return (
    <>
      <div
        className="flex flex-row bg-white w-96 h-12 rounded drop-shadow-md items-center cursor-pointer px-5"
        onClick={() => setActivate(!activate)}
      >
        <p className="w-[90%]">{value !== -1 ? actionlist[value].name : placeHolder}</p>
        <img className="w-6 h-6" src={"/assets/Images/arrow-down.svg"} />
      </div>
      {activate && (
        <div className="absolute z-40 w-96 flex flex-col">
          {Object.keys(actionlist).map((action, key) => (
            <p key={key} className="cursor-pointer font-bold bg-white p-2"
              onClick={() => {
                setActivate(false);
                onChange(actionlist[action].id);
              }}
            >
              {actionlist[action].name}
            </p>
          ))}
        </div>
      )}
    </>
  );
};

export default DropDown;
