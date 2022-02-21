import React, { useEffect, useState } from 'react'
import MainButton from "../../components/utils/MainButton";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";

const CREATE_UNIQUE_ACTION = `
  mutation create_withid($actionid: String!, $param: String!) {
    CreateUniqueActionByBaseActionId (data: {action_id: $actionid, parameters: $param, old_values: ""}) {
      id
    }
  }
`

const CREATE_BAYS = `
  mutation create_withid($actionidfrom: String!, $actionidto: String!, $name: String!, $active: Boolean!, $userid: String!) {
    CreateBayAction (data: {action_trigger_id: $actionidfrom, action_effect_id: $actionidto, name: $name, active: $active, userid: $userid}) {
      id
    }
  }
`

const TestBay = ({BayData, slide, slideTo, tested, setTested}) => {
  const [checkError, setError] = React.useState({
    error: true,
    message: ""
  })
  const [duringtest, setDuring] = useState({
    running: false,
    success: -1,
    message: ""
  })

  // const [createUniqueAction, { data, loading, error }] = useMutation(CREATE_UNIQUE_ACTION);
  // const [createBay, { data, loading, error }] = useMutation(CREATE_BAYS);

  const countKeys = (obj) => {
    var res = Object.keys(obj).length

    for (var x in obj) {
      if (obj[x] == "")
       res -= 1;
    }
    return res;
  }

  const checkData = () => {
    try {
      console.log(countKeys(BayData.from.actions.value), JSON.parse(BayData.from.service.actions[BayData.from.actions.index].options).length)
    } catch (e) {}
    try {
      console.log(countKeys(BayData.to.actions.value), JSON.parse(BayData.to.service.actions[BayData.to.actions.index].options).length)
    } catch (e) {}
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
    } else if (countKeys(BayData.from.actions.value) != JSON.parse(BayData.from.service.actions[BayData.from.actions.index].options).length) {
      setError({error: true, message: <>Service {BayData.from.service.name} no value filled!<br/>You need to fill every field before testing</>})
    } else if (countKeys(BayData.to.actions.value) != JSON.parse(BayData.to.service.actions[BayData.to.actions.index].options).length) {
      setError({error: true, message: <>Service {BayData.to.service.name} no value filled!<br/>You need to fill every field before testing</>})
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
      },
      body: JSON.stringify({
        query: CREATE_UNIQUE_ACTION,
        variables: {
          actionid: BayData.from.service.actions[BayData.from.actions.index].id,
          param: JSON.stringify(BayData.from.actions.value)
        },
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result)
      id1 = result.data.CreateUniqueActionByBaseActionId.id
    });

    await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CREATE_UNIQUE_ACTION,
        variables: {
          actionid: BayData.to.service.actions[BayData.to.actions.index].id,
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
      },
      body: JSON.stringify({
        query: CREATE_BAYS,
        variables: {
          actionidfrom: id1,
          actionidto: id2,
          name: BayData.data.description,
          active: BayData.data.active,
          userid: window.sessionStorage.USERID
        },
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      console.log(result)
    });
  }

  const playTest = async () => {
    setDuring({
      running: true,
      success: -1,
      message: ""
    })
    setTimeout(() => {
      setTested(true)
      setDuring({
        running: false,
        success: 1,
        message: "Test success let's run this Bay"
      })
    }, 1000)
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
              <span className='font-bold text-md'>When {BayData.from.service.actions[BayData.from.actions.index].name}</span>
              {JSON.parse(BayData.from.service.actions[BayData.from.actions.index].options).map((elem, key) => {
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
              <span className='font-bold text-md'>Do {BayData.to.service.actions[BayData.to.actions.index].name}</span>
              {JSON.parse(BayData.to.service.actions[BayData.to.actions.index].options).map((elem, key) => {
                return (
                  <span key={key} className='text-sm ml-5'>With {elem.name} as {BayData.to.actions.value[key]}</span>
                )
              })}
            </div>
          </div>
        </div>
        {duringtest.running &&
          <div className='flex items-center justify-center bg-light border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mb-10 mt-10'>
            <Spinner/>
          </div>
        }
        {(duringtest.success == 0 && !tested) &&
          <div className='flex items-center justify-center bg-red border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mb-10 mt-10'>
            <span className='flex font-bold text-sm'>
              {duringtest.message}
            </span>
          </div>
        }
        {(duringtest.success == 1 && tested) &&
          <div className='flex items-center justify-center bg-light border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mt-10 mb-10'>
            <span className='flex font-bold text-sm'>
              {duringtest.message}
            </span>
          </div>
        }
      </div>
      }
      <div className="flex w-full pt-7">
        <div className="flex w-full justify-start">
          <MainButton text={"Back"} color='light' action={() => {slideTo(slide - 1)}}></MainButton>
        </div>
        { tested ? 
        <div className="flex w-full justify-end">
          <MainButton text={"Create"} color='light' action={() => processCreation()}></MainButton>
        </div> :
        <div className="flex w-full justify-end">
          <MainButton text={"Test"} disable={duringtest.running || checkError.error} color='dark' action={() => {playTest()}}></MainButton>
        </div>
        }
      </div>
    </div>
  );
}

export default TestBay;