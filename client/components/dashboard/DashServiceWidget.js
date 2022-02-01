import React, { useState } from "react";
import DashServiceBox from "./DashServiceBox";

const SERVICES = [
  {
    id: 0,
    name: "Youtube",
    icon: "/assets/Images/youtube.svg",
  },
  {
    id: 1,
    name: "Spotify",
    icon: "/assets/Images/youtube.svg",
  },
  {
    id: 2,
    name: "Twitter",
    icon: "/assets/Images/youtube.svg",
  },
  {
    id: 3,
    name: "Gmail",
    icon: "/assets/Images/youtube.svg",
  },
  {
    id: 4,
    name: "Test",
    icon: "/assets/Images/youtube.svg",
  },
  {
    id: 5,
    name: "Test2",
    icon: "/assets/Images/youtube.svg",
  },
];

const DashServiceWidget = ({text}) => {
  const [selected, setSelected] = useState(-1);

  const click = (id) => {
    if (selected === id) setSelected(-1);
    else setSelected(id);
  };

  return (
    <div className="flex flex-col h-full w-[40%] drop-shadow-lg bg-white rounded p-5">
      <h2 className="text-lg font-bold">{text}</h2>
      <div className="flex flex-row flex-wrap w-full">
        {SERVICES.map((service) => (
          <DashServiceBox
            {...service}
            action={click}
            selected={selected}
            key={service.id}
          />
        ))}
      </div>
      {selected !== -1 && (
        <h3 className="text-center text-lg mt-8 font-bold text-light">{SERVICES[selected].name}</h3>
      )}
    </div>
  );
};

export default DashServiceWidget;
