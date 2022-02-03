import React, { useEffect, useState } from 'react'
import MainButton from "../../components/utils/MainButton";
import { Spinner } from "react-activity";
import "react-activity/dist/Spinner.css";

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

  const countKeys = (obj) => {
    let res = Object.keys(obj).length

    for (var x in obj) {
      if (obj[x] == "")
       res -= 1;
    }
    return res;
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
    } else if (BayData.from.happens.index == -1) {
      setError({error: true, message: <>Service {BayData.from.service.name} no trigger selectionned!<br/>You need to select one trigger before testing</>})
    } else if (BayData.to.actions.index == -1) {
      setError({error: true, message: <>Service {BayData.to.service.name} no actions selectionned!<br/>You need to select one actions before testing</>})
    } else if (countKeys(BayData.from.happens.value) != BayData.from.service.happens[BayData.from.happens.index].options.length) {
      setError({error: true, message: <>Service {BayData.from.service.name} no value filled!<br/>You need to fill every field before testing</>})
    } else if (countKeys(BayData.to.actions.value) != BayData.to.service.actions[BayData.to.actions.index].options.length) {
      setError({error: true, message: <>Service {BayData.to.service.name} no value filled!<br/>You need to fill every field before testing</>})
    } else {
      setError({
        error: false,
        message: ""
      })
    }
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
        <div className="flex flex-row items-center text-center justify-between mb-10">
          <div className='flex flex-row justify-around w-[40%]'>
            <img className="w-[20%]" src={BayData.from.service.icon} />
            <div className='flex flex-col items-start'>
              <span className='font-bold text-md'>When {BayData.from.service.happens[BayData.from.happens.index].name}</span>
              {BayData.from.service.happens[BayData.from.happens.index].options.map((elem, key) => {
                return (
                  <span key={key} className='text-sm ml-5'>With {elem.name} as {BayData.from.happens.value[key]}</span>
                )
              })}
            </div>
          </div>
          <div className="flex bg-dark rounded-full h-6 w-12 items-center justify-center">
            <img src={"/assets/Images/arrow-right.svg"} />
          </div>
          <div className='flex flex-row justify-around w-[40%]'>
            <img className="w-[20%]" src={BayData.to.service.icon} />
            <div className='flex flex-col items-start'>
              <span className='font-bold text-md'>Do {BayData.to.service.actions[BayData.to.actions.index].name}</span>
              {BayData.to.service.actions[BayData.to.actions.index].options.map((elem, key) => {
                return (
                  <span key={key} className='text-sm ml-5'>With {elem.name} as {BayData.to.actions.value[key]}</span>
                )
              })}
            </div>
          </div>
        </div>
        {duringtest.running &&
          <div className='flex items-center justify-center bg-light border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mb-10'>
            <Spinner/>
          </div>
        }
        {(duringtest.success == 0 && !tested) &&
          <div className='flex items-center justify-center bg-red border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mb-10'>
            <span className='flex font-bold text-sm'>
              {duringtest.message}
            </span>
          </div>
        }
        {(duringtest.success == 1 && tested) &&
          <div className='flex items-center justify-center bg-light border-4 border-dark opacity-60 h-[40%] w-[60%] m-auto mb-10'>
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
          <MainButton text={"Next"} color='light' action={() => {slideTo(slide + 1)}}></MainButton>
        </div> :
        <div className="flex w-full justify-end">
          <MainButton text={"Test"} disable={duringtest.running} color='dark' action={() => {playTest()}}></MainButton>
        </div>
        }
      </div>
    </div>
  );
}

export default TestBay;