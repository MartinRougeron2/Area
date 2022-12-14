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
      icon
      actions {
        id
        name
        options
        type
        auth_url
      }
    }
  }`;

const DashboardPage = () => {
  const [triggerId, setTriggerId] = useState(-1)
  const [effectId, setEffectId] = useState(-1)

  const [actionsTriggerList, setActionsTriggerList] = useState({})
  const [actionsEffectList, setActionsEffectList] = useState({})
  const [actionsTriggerIndex, setActionsTriggerIndex] = useState(-1)
  const [actionsEffectIndex, setActionsEffectIndex] = useState(-1)

  const {loading, error, data} = useQuery(GET_SERVICES)

  useEffect(() => {
    if (data && triggerId !== -1) {
      setActionsTriggerIndex(-1)
      const service = data.GetAllServices.find(elem => elem.id === triggerId)
      const actions = {}

      service.actions.forEach(action => {
        if (action.type === "BOTH")
          actions[action.id] = (action)
        if (action.type == "TRIGGER")
          actions[action.id] = (action)
      })
      setActionsTriggerList(actions)
    }
  }, [triggerId])

  useEffect(() => {
    if (data && effectId !== -1) {
      setActionsEffectIndex(-1)
      const service = data.GetAllServices.find(elem => elem.id === effectId)
      const actions = {}
      service.actions.forEach(action => {
        if (action.type === "BOTH")
          actions[action.id] = (action)
        if (action.type == "EFFECT")
          actions[action.id] = (action)
        })
      Object.keys(actions).map(elem => console.log(elem))
      setActionsEffectList(actions)
    }
  }, [effectId])

  return (
    <div className="w-screen h-screen flex flex-row">
      <DashSideBar />
      <div className="flex flex-col h-screen w-[82%] p-10">
        <DashHeader />
        <h2 className="text-center text-lg font-bold">Make a Bay</h2>
        <div className="flex flex-row justify-between items-center w-full mt-3">
          {error ? <p>Error while loading services</p> : <>
          {loading ? <Spinner/> : <DashServiceWidget text={"S??l??ctionez une application"} services={data.GetAllServices} selected={triggerId} setSelected={setTriggerId}/>}
          <RoundButton icon={"/assets/Images/plus.svg"}/>
          {loading ? <Spinner/> : <DashServiceWidget text={"S??lectionnez en une autre"} services={data.GetAllServices} selected={effectId} setSelected={setEffectId}/>}
          </>}
        </div>
        {(triggerId !== -1 && effectId !== -1) &&
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
                  service: data.GetAllServices.find(elem => elem.id == triggerId),
                  actions: {
                    index: actionsTriggerList[actionsTriggerIndex].id,
                  }
                },
                to: {
                  service: data.GetAllServices.find(elem => elem.id == effectId),
                  actions: {
                    index: actionsEffectList[actionsEffectIndex].id,
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
