import React, { useEffect, useState } from 'react'
import MainButton from "../../components/utils/MainButton";
import "react-activity/dist/Spinner.css";
import Switch from "react-switch";
import InputSimple from "../../components/utils/Input";

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const CREATE_UNIQUE_ACTION = `
  mutation create_withid($actionid: String!, $param: String!) {
    CreateUniqueActionByBaseActionId (data: {action_id: $actionid, parameters: $param, old_values: ""}) {
      id
    }
  }
`

const CREATE_BAYS = `
  mutation create_withid($actionidfrom: String!, $actionidto: String!, $name: String!, $active: Boolean!) {
    CreateBayAction (data: {action_trigger_id: $actionidfrom, action_effect_id: $actionidto, name: $name, active: $active}) {
      id
    }
  }
`

const TestBay = ({BayData, slide, slideTo}) => {
  const [checkError, setError] = React.useState({
    error: true,
    message: ""
  })
  const [name, setName] = useState("Default name")
  const [active, setActive] = useState(false)

  const getActionById = (actions, id) => {
    return actions.find(elem => elem.id === id)
  }

  const checkData = () => {
    if (!BayData) {
      setError({error: true, message: <>Error while loading BayData</>})
    } else if (!BayData.from.service || !BayData.to.service) {
      setError({error: true, message: <>Error while loading Service</>})
    } else if (!BayData.from.connected) {
      setError({error: true, message: <>Service {BayData.from.service.name} not connected!<br/>You need to connect service before testing</>})
    } else if (!BayData.to.connected) {
      setError({error: true, message: <>Service {BayData.to.service.name} not connected!<br/>You need to connect service before testing</>})
    } else if (BayData.from.actions.index == -1) {
      setError({error: true, message: <>Service {BayData.from.service.name} no trigger selectionned!<br/>You need to select one trigger before testing</>})
    } else if (BayData.to.actions.index == -1) {
      setError({error: true, message: <>Service {BayData.to.service.name} no actions selectionned!<br/>You need to select one actions before testing</>})
    } else {
      setError({
        error: false,
        message: ""
      })
    }
  }

  const processCreation = async () => {
    let id1, id2;
    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': cookies.get('x-token')
      },
      body: JSON.stringify({
        query: CREATE_UNIQUE_ACTION,
        variables: {
          actionid: getActionById(BayData.from.service.actions, BayData.from.actions.index).id,
          param: JSON.stringify(BayData.from.actions.value)
        },
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      id1 = result.data.CreateUniqueActionByBaseActionId.id
    });

    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': cookies.get('x-token')
      },
      body: JSON.stringify({
        query: CREATE_UNIQUE_ACTION,
        variables: {
          actionid: getActionById(BayData.to.service.actions, BayData.to.actions.index).id,
          param: JSON.stringify(BayData.to.actions.value)
        },
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result)
      id2 = result.data.CreateUniqueActionByBaseActionId.id
    });

    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': cookies.get('x-token')
      },
      body: JSON.stringify({
        query: CREATE_BAYS,
        variables: {
          actionidfrom: id1,
          actionidto: id2,
          name: name,
          active: active,
        },
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result)
    });
    location.href = "/dashboard/bays"
  }

  useEffect(() => {checkData()}, [BayData])
  return (
    <div className="flex flex-col items-center p-5 h-full w-full">
      <h2 className="text-lg font-bold mt-6 mb-8">Test your Bay</h2>
      {checkError.error ? (
        <div className='flex items-center justify-center text-center bg-red opacity-60 h-[30%] w-[50%] rounded'>
          <span className='flex font-bold text-sm'>
            {checkError.message}
          </span>
        </div>
      ) :
      <div className="w-full drop-shadow-lg bg-white rounded p-5 mb-5 w-[80%]">
        <div className="flex flex-row items-center text-center justify-between">
          <div className='flex flex-row justify-around w-[45%]'>
            <img className="w-[20%]" src={BayData.from.service.icon} />
            <div className='flex flex-col items-start'>
              <span className='font-bold text-md'>When {getActionById(BayData.from.service.actions, BayData.from.actions.index).name}</span>
              {getActionById(BayData.from.service.actions, BayData.from.actions.index).options !== "" &&  JSON.parse(getActionById(BayData.from.service.actions, BayData.from.actions.index).options).map((elem, key) => {
                return (
                  <span key={key} className='text-sm ml-5'>With {elem.name} as {BayData.from.actions.value[key]}</span>
                )
              })}
            </div>
          </div>
          <div className="flex bg-dark rounded-full h-6 w-12 items-center justify-center">
            <img src={"/assets/Images/arrow-right.svg"} />
          </div>
          <div className='flex flex-row justify-around w-[45%]'>
            <img className="w-[20%]" src={BayData.to.service.icon} />
            <div className='flex flex-col items-start'>
              <span className='font-bold text-md'>Do {getActionById(BayData.to.service.actions, BayData.to.actions.index).name}</span>
              {getActionById(BayData.to.service.actions, BayData.to.actions.index).options !== "" && JSON.parse(getActionById(BayData.to.service.actions, BayData.to.actions.index).options).map((elem, key) => {
                return (
                  <span key={key} className='text-sm ml-5'>With {elem.name} as {BayData.to.actions.value[key]}</span>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex row items-center justify-around">
          <div className="flex row items-center">
            <span>Bay name: </span>
            <InputSimple value={name} onChange={setName}/>
          </div>
          <div className="flex row items-center">
            <span>Active: </span>
            <Switch
              checked={active}
              onChange={() => setActive(!active)}
            />
          </div>
        </div>
      </div>
      }
      <div className="flex w-full pt-7">
        <div className="flex w-full justify-start">
          <MainButton text={"Back"} color='light' action={() => {slideTo(slide - 1)}}></MainButton>
        </div>
        <div className="flex w-full justify-end">
          <MainButton text={"Create"} color='light' action={() => processCreation()}></MainButton>
        </div>
      </div>
    </div>
  );
}

export default TestBay;