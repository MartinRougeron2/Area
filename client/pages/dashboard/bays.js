import React from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashBayPreview from "../../components/dashboard/DashBayPreview";
import DashSideBar from "../../components/dashboard/DashSideBar";
import DropDown from "../../components/dashboard/DropDown";
import RoundButton from "../../components/dashboard/RoundButton";
import MainButton from "../../components/utils/MainButton";

const MYBAYS = [
  {
    from: {
      service: {
        id: 0,
        name: "Youtube",
        icon: "/assets/Images/youtube.svg",
      }
    },
    to: {
      service: {
        id: 2,
        name: "Twitter",
        icon: "/assets/Images/youtube.svg",
      }
    },
    data: {
      active: true,
      description: "Upload vidéo on comment"
    }
  },
  {
    from: {
      service: {
        id: 0,
        name: "Youtube",
        icon: "/assets/Images/youtube.svg",
      }
    },
    to: {
      service: {
        id: 2,
        name: "Twitter",
        icon: "/assets/Images/youtube.svg",
      }
    },
    data: {
      active: true,
      description: "Upload vidéo on comment"
    }
  }
];

const BaysPage = () => {
  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-lg font-bold">Mes Bays</h2>
        <div className="flex flex-col w-full h-[50%] mt-3">
          {MYBAYS.map((elem, id) => {
            return(
              <DashBayPreview bay={elem} key={id}/>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default BaysPage;
