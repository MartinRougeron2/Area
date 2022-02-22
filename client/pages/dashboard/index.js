import React, {useEffect, useState} from "react";
import DashHeader from "../../components/dashboard/DashHeader";
import DashServiceWidget from "../../components/dashboard/DashServiceWidget";
import DashSideBar from "../../components/dashboard/DashSideBar";
import DropDown from "../../components/dashboard/DropDown";
import RoundButton from "../../components/dashboard/RoundButton";
import MainButton from "../../components/utils/MainButton";
import {
  useQuery,
  gql
} from "@apollo/client";

import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";

const GET_SERVICES = gql`
  query get_services {
    GetAllServices {
      id
      name
      actions {
        id
        name
        options
        type
      }
    }
  }`;

const DashboardPage = () => {
  const [triggerIndex, setTriggerIndex] = useState(-1)
  const [effectIndex, setEffectIndex] = useState(-1)

  const [actionsTriggerList, setActionsTriggerList] = useState([])
  const [actionsEffectList, setActionsEffectList] = useState([])
  const [actionsTriggerIndex, setActionsTriggerIndex] = useState(-1)
  const [actionsEffectIndex, setActionsEffectIndex] = useState(-1)

  const {loading, error, data} = useQuery(GET_SERVICES)

  useEffect(() => {
    if (data) {
      setActionsTriggerIndex(-1)
      const service = data.GetAllServices.find(elem => elem.id === triggerIndex)
      setActionsTriggerList(service.actions)
    }
  }, [triggerIndex])

  useEffect(() => {
    if (data) {
      setActionsEffectIndex(-1)
      const service = data.GetAllServices.find(elem => elem.id === effectIndex)
      setActionsEffectList(service.actions)
    }
  }, [effectIndex])

  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-center text-lg font-bold">Make a Bay</h2>
        <div className="flex flex-row justify-between items-center w-full mt-3">
          {error ? <p>Error while loading services</p> : <>
          {loading ? <Spinner/> : <DashServiceWidget text={"Séléctionez une application"} services={data.GetAllServices} selected={triggerIndex} setSelected={setTriggerIndex}/>}
          <RoundButton icon={"/assets/Images/plus.svg"}/>
          {loading ? <Spinner/> : <DashServiceWidget text={"Sélectionnez en une autre"} services={data.GetAllServices} selected={effectIndex} setSelected={setEffectIndex}/>}
          </>}
        </div>
        {(triggerIndex !== -1 && effectIndex !== -1) &&
        <>
          <div className="bg-white w-full drop-shadow-md mt-8 p-5">
            <h2 className="text-md font-medium">Selectionnez une action</h2>
            <div className="flex flex-row w-full justify-around items-center">
              <div className='flex w-[40%]'>
                <DropDown actionlist={actionsTriggerList} value={actionsTriggerIndex} onChange={setActionsTriggerIndex} placeHolder="placeholder"/>
              </div>
              <RoundButton icon={"/assets/Images/arrow-right.svg"}/>
              <div className='flex w-[40%]'>
                <DropDown actionlist={actionsEffectList} value={actionsEffectIndex} onChange={setActionsEffectIndex} placeHolder="placeholder"/>
              </div>
            </div>
          </div>
          <div className="flex w-80 mt-10">
            <MainButton text="Make a Bay" action={() => {
              window.sessionStorage.setItem("CREATE_BAY", JSON.stringify({
                from: {
                  service: data.GetAllServices.find(elem => elem.id == triggerIndex),
                  actions: {
                    index: actionsTriggerIndex,
                  }
                },
                to: {
                  service: data.GetAllServices.find(elem => elem.id == effectIndex),
                  actions: {
                    index: actionsEffectIndex,
                  }
                }
              }));
              window.location.href = '/create'
            }}/>
          </div>
        </>
        }
      </div>
    </div>
  );
};

export default DashboardPage;
