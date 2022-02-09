import React, {useEffect, useState} from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashServiceWidget from "../../components/dashboard/DashServiceWidget";
import DashSideBar from "../../components/dashboard/DashSideBar";
import DropDown from "../../components/dashboard/DropDown";
import RoundButton from "../../components/dashboard/RoundButton";
import MainButton from "../../components/utils/MainButton";

import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";

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
  const [services, setServices] = React.useState(null)
  const [loadingServices, setLoadingServices] = React.useState(true)
  const [errorLoading, setErrorLoading] = React.useState(false)

  const [triggerIndex, setTriggerIndex] = useState(-1)
  const [effectIndex, setEffectIndex] = useState(-1)

  const [actionsTriggerIndex, setActionsTriggerIndex] = useState(-1)
  const [actionsEffectIndex, setActionsEffectIndex] = useState(-1)

  useEffect(() => {
    async function fetchServices() {
      const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `
          query {
              GetServices {
                actions
                id
                name
                icon
            }
          }`
        })
      };
      const response = await fetch(`${process.env.REACT_APP_APIURL}/graphql`, requestOptions)
        .then(data => data.json())
        .then(data => {setServices(data); setLoadingServices(false)})
        .catch(error => setErrorLoading(true))
      setLoadingServices(false)
    }
    fetchServices();
  }, [])

  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-center text-lg font-bold">Make a Bay</h2>
        <div className="flex flex-row justify-between items-center w-full mt-3">
          {loadingServices ? <Spinner/> : <DashServiceWidget text={"Séléctionez une application"} services={services} selected={triggerIndex} setSelected={setTriggerIndex}/>}
          <RoundButton icon={"/assets/Images/plus.svg"}/>
          {loadingServices ? <Spinner/> : <DashServiceWidget text={"Sélectionnez en une autre"} services={services} selected={effectIndex} setSelected={setEffectIndex}/>}
        </div>
        {(triggerIndex !== -1 && effectIndex !== -1) &&
        <>
          <div className="bg-white w-full drop-shadow-md mt-8 p-5">
            <h2 className="text-md font-medium">Selectionnez une action</h2>
            <div className="flex flex-row w-full justify-around items-center">
              <div className='flex w-[40%]'>
                <DropDown actionlist={ACTIONLIST} value={actionsTriggerIndex} onChange={setActionsTriggerIndex} placeHolder="placeholder"/>
              </div>
              <RoundButton icon={"/assets/Images/arrow-right.svg"}/>
              <div className='flex w-[40%]'>
                <DropDown actionlist={ACTIONLIST} value={actionsEffectIndex} onChange={setActionsEffectIndex} placeHolder="placeholder"/>
              </div>
            </div>
          </div>
          <div className="flex w-80 mt-10">
            <MainButton text="Make a Bay"/>
          </div>
        </>
        }
      </div>
    </div>
  );
};

export default DashboardPage;
