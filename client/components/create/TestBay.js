import React, { useEffect } from 'react'
import MainButton from "../../components/utils/MainButton";

const TestBay = ({BayData, slide, slideTo}) => {
  const [checkError, setError] = React.useState({
    error: false,
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

  useEffect(() => {checkData()}, [BayData])
  return (
    <div className="flex flex-col items-center p-5 h-full w-full">
      <h2 className="text-lg font-bold mt-6 mb-8">Test your Bay</h2>
      { checkError.error ? (
        <div className='flex items-center justify-center text-center bg-red opacity-60 h-[30%] w-[50%] rounded'>
          <span className='flex font-bold text-sm'>
            {checkError.message}
          </span>
        </div>
      ) :
      <div className="w-full drop-shadow-lg bg-white rounded p-5 mb-5">
        <div className="flex flex-row items-center justify-between">
        </div>
      </div>
      }
      <div className="flex w-full pt-7">
        {
        slide != 0 &&
        <div className="flex w-full justify-start">
          <MainButton text={"Back"} color='light' action={() => {slideTo(slide - 1)}}></MainButton>
        </div>
        }
        <div className="flex w-full justify-end">
          <MainButton text={"Next"} color='light' action={() => {slideTo(slide + 1)}}></MainButton>
        </div>
      </div>
    </div>
  );
}

export default TestBay;